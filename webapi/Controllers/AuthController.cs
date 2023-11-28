using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        var signInResult = await _signInManager.PasswordSignInAsync(user, login.Password, true, true);
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
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

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
    public async Task<ActionResult<ResponseResult>> Refresh(TokenRefreshModel tokenRefreshModel)
    {
        var accessToken = tokenRefreshModel.AccessToken;
        var refreshToken = tokenRefreshModel.RefreshToken;
        if (accessToken is null || refreshToken is null)
            return BadRequest(ResponseResult.RefreshTokenRequestInvalidError);
        
        var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
        var userId = principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
            return BadRequest(ResponseResult.RefreshTokenInvalidError);
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return BadRequest(ResponseResult.RefreshTokenInvalidError);
        var claims = await GetUserClaims(user);
        
        var newAccessToken = _tokenService.GenerateAccessToken(claims);
        var newRefreshToken = _tokenService.GenerateRefreshToken();
        user.RefreshToken = newRefreshToken;
        await _userManager.UpdateAsync(user);
        
        return Ok(new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken
        });
    }
    
    [HttpPost, Authorize]
    [Route("RevokeToken")]
    public async Task<IActionResult> Revoke()
    {
        var user = await GetUser();
        if (user == null) return BadRequest();
        
        user.RefreshToken = null;
        await _userManager.UpdateAsync(user);
        return NoContent();
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