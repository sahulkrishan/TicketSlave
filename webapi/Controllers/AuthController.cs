using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Classes;
using webapi.Models;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace webapi.Controllers;

[ApiController]
[Route("/api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;

    public AuthController(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _context = context;
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost]
    [Route("Login")]
    public async Task<ActionResult<List<ResponseResult>>> Login([FromBody] LoginModel login)
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

        if (signInResult == SignInResult.Success)
        {
            return Ok();
        }

        return Unauthorized(signInResult);
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
            UserName = registerModel.Email,
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

    [HttpGet]
    [Route("ConfirmEmail")]
    public async Task<ActionResult<ResponseResult>> ConfirmEmail(string token, string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return BadRequest(ResponseResult.EmailNotFoundError);
        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded ? Ok() : BadRequest(result.Errors);
    }
}