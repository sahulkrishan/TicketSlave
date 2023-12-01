using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using webapi.Classes;
using webapi.Models;
using webapi.Services;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace webapi.Controllers;

[ApiController]
[Route("/api/v1/[controller]")]
public class AuthController : ControllerBase
{
  private readonly AppDbContext _context;
  private readonly UserManager<ApplicationUser> _userManager;
  private readonly SignInManager<ApplicationUser> _signInManager;
  private readonly ITokenService _tokenService;
  private const int RefreshTokenExpiryDays = 30;

  public AuthController(
    AppDbContext context,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ITokenService tokenService)
  {
    _context = context;
    _userManager = userManager;
    _signInManager = signInManager;
    _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
  }

  [HttpPost]
  [Route("Login")]
  public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginModel login)
  {
    var user = await _userManager.FindByEmailAsync(login.Email);
    if (user == null)
      return BadRequest(new List<ResponseResult>
        { ResponseResult.EmailNotFoundError }
      );

    var signInResult = await _signInManager.CheckPasswordSignInAsync(user, login.Password, true);
    if (signInResult == SignInResult.Failed)
    {
      return Unauthorized(new List<ResponseResult>
        { ResponseResult.IncorrectPasswordError }
      );
    }

    if (signInResult == SignInResult.LockedOut)
    {
      return Unauthorized(new List<ResponseResult>
        { ResponseResult.UserLockedOutError }
      );
    }

    if (signInResult == SignInResult.NotAllowed)
    {
      if (user.EmailConfirmed == false)
        return Unauthorized(new List<ResponseResult>
          { ResponseResult.VerificationRequiredError }
        );
      if (user.LockoutEnabled)
        return Unauthorized(new List<ResponseResult>
          { ResponseResult.UserSignInNotAllowedError }
        );
    }

    if (signInResult != SignInResult.Success) return Unauthorized(signInResult);

    var claims = await GetUserClaims(user);

    var accessToken = _tokenService.GenerateAccessToken(claims);
    var refreshToken = _tokenService.GenerateRefreshToken();
    user.RefreshTokens.Add(new RefreshToken
    {
      Token = refreshToken,
      ExpiresOn = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays)
    });

    await _userManager.UpdateAsync(user);

    return Ok(new AuthResponse
    {
      AccessToken = accessToken,
      RefreshToken = refreshToken
    });
  }

  [HttpPost]
  [Route("Register")]
  public async Task<ActionResult<List<ResponseResult>>> Register([FromBody] RegisterModel registerModel)
  {
    if (!registerModel.AcceptedTerms)
      return BadRequest(new List<ResponseResult>
        { ResponseResult.DeclinedTermsError }
      );

    var userExists = await _userManager.FindByNameAsync(registerModel.Email);
    if (userExists != null)
      return BadRequest(new List<ResponseResult>
        { ResponseResult.UserExistsError }
      );

    // Create new user
    var user = new ApplicationUser
    {
      FirstName = registerModel.FirstName,
      LastName = registerModel.LastName,
      Email = registerModel.Email,
      AcceptedTerms = registerModel.AcceptedTerms,
      DateAcceptedTerms = registerModel.AcceptedTerms ? DateTime.UtcNow : null
    };

    // Save new user
    var result = await _userManager.CreateAsync(user, registerModel.Password);
    if (result != IdentityResult.Success)
    {
      return BadRequest(result.Errors.Select(identityError => new ResponseResult().Parse(identityError))
        .ToList());
    }

    // Assign User role to newly created user
    var roles = new[] { ApplicationRoles.User };
    var assignRolesResult = await _userManager.AddToRolesAsync(user, roles);
    if (assignRolesResult != IdentityResult.Success)
      return BadRequest(result.Errors.Select(identityError => new ResponseResult().Parse(identityError))
        .ToList());

    if (user.EmailConfirmed == false)
      // Send confirmation email
      // await SendConfirmationEmail(user);
      return Ok(ResponseResult.AwaitingAccountVerification);

    return Ok();
  }

  // TODO: Send confirmation email
  private async Task<ActionResult<ResponseResult>> SendConfirmationEmail(ApplicationUser user)
  {
    var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

    // !!!!!!!!!!!! FIXME !!!!!!!!!!!!
    // Temporarily confirm email automatically
    if (user.Email != null) await ConfirmEmail(token, user.Email);
    // !!!!!!!!!!!! FIXME !!!!!!!!!!!!
    return Ok();
  }

  [HttpPost]
  [Route("ConfirmEmail")]
  public async Task<ActionResult<ResponseResult>> ConfirmEmail(string token, string email)
  {
    var user = await _userManager.FindByEmailAsync(email);
    if (user == null)
      return BadRequest(ResponseResult.EmailNotFoundError);
    var result = await _userManager.ConfirmEmailAsync(user, token);
    return result.Succeeded ? Ok() : BadRequest(result.Errors);
  }

  [HttpPost]
  [Route("RefreshToken")]
  public async Task<ActionResult> Refresh(TokenRefreshModel tokenRefreshModel)
  {
    try
    {
      var accessToken = tokenRefreshModel.AccessToken;
      var refreshToken = tokenRefreshModel.RefreshToken;
      if (accessToken is null || refreshToken is null)
        throw new SecurityTokenMalformedException();

      var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
      var userId = principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
      if (userId == null)
        throw new SecurityTokenDecompressionFailedException();

      var user = await _userManager
        .Users
        .Include(u => u.RefreshTokens)
        .FirstOrDefaultAsync(u => u.Id == userId);
      if (user == null)
        throw new Exception();

      var userRefreshToken = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
      if (userRefreshToken == null || userRefreshToken.ExpiresOn <= DateTime.UtcNow)
        throw new SecurityTokenExpiredException();
      var claims = await GetUserClaims(user);

      var newAccessToken = _tokenService.GenerateAccessToken(claims);
      var newRefreshToken = _tokenService.GenerateRefreshToken();

      user.RefreshTokens.Remove(userRefreshToken);

      var refreshTokens = user.RefreshTokens.ToList();
      refreshTokens.Add(new RefreshToken
      {
        Token = newRefreshToken,
        ExpiresOn = DateTime.UtcNow.AddDays(RefreshTokenExpiryDays)
      });

      user.RefreshTokens = refreshTokens;


      await _userManager.UpdateAsync(user);

      return Ok(new AuthResponse
      {
        AccessToken = newAccessToken,
        RefreshToken = newRefreshToken
      });
    }
    catch (Exception e)
    {
      return StatusCode(StatusCodes.Status403Forbidden, ResponseResult.RefreshTokenRequestInvalidError);
    }
  }

  [HttpPost, Authorize]
  [Route("RevokeToken")]
  public async Task<IActionResult> RevokeToken(string refreshToken)
  {
    var user = await GetUser();
    if (user == null) return BadRequest();

    var userRefreshToken = user.RefreshTokens.FirstOrDefault(rt => rt.Token == refreshToken);
    if (userRefreshToken == null) return BadRequest();

    user.RefreshTokens.Remove(userRefreshToken);
    await _userManager.UpdateAsync(user);
    return NoContent();
  }

  [HttpPost, Authorize]
  [Route("RevokeTokenAll")]
  public async Task<IActionResult> RevokeTokenAll()
  {
    var user = await GetUser();
    if (user == null) return BadRequest();

    user.RefreshTokens = new List<RefreshToken>();
    await _userManager.UpdateAsync(user);
    return NoContent();
  }

  [HttpGet]
  [Route("Authorized")]
  public async Task<IActionResult> Authorized()
  {
    var user = await GetUser();
    if (user == null) return Unauthorized();
    return Ok(user.RefreshTokens);
  }

  [Authorize]
  private async Task<ApplicationUser?> GetUser()
  {
    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId != null) return await _userManager.FindByIdAsync(userId);

    var email = User.FindFirstValue(ClaimTypes.Email);
    if (email != null) return await _userManager.FindByEmailAsync(email);

    return null;
  }

  private async Task<List<Claim>> GetUserClaims(ApplicationUser user)
  {
    var claims = new List<Claim>
    {
      new(ClaimTypes.Email, user.Email ?? throw new InvalidOperationException()),
      new(ClaimTypes.NameIdentifier, user.Id)
    };
    var roles = await _userManager.GetRolesAsync(user);
    claims.AddRange(roles.Select(item => new Claim(ClaimTypes.Role, item)));
    return claims;
  }
}