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
    public async Task<ActionResult> Login([FromBody] LoginModel login)
    {
        var user = await _userManager.FindByEmailAsync(login.Email);
        if (user == null)
            return Unauthorized();

        var signInResult = await _signInManager.PasswordSignInAsync(user, login.Password, true, true);
        if (signInResult == SignInResult.Success)
        {
            if (user.AcceptedTerms == false)
                return BadRequest(new List<ErrorResponse>
                {
                    DeclinedTermsError()
                });

            return Ok();
        }

        var events = _context.Events.ToList();
        return Unauthorized(signInResult);
    }

    [HttpPost]
    [Route("Register")]
    public async Task<ActionResult<Response<object>>> Register([FromBody] RegisterModel registerModel)
    {
        if (!registerModel.AcceptedTerms)
            return BadRequest(new Response<object>
            {
                Errors = new List<ErrorResponse>
                    { DeclinedTermsError() }
            });

        var userExists = await _userManager.FindByNameAsync(registerModel.Email);
        if (userExists != null)
            return BadRequest(new Response<object>
            {
                Errors = new List<ErrorResponse>
                    { UserExistsError() }
            });

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
            return BadRequest(new Response<object>
            {
                Status = StatusCodes.Status400BadRequest,
                Errors = result.Errors.Select(identityError => new ErrorResponse().Parse(identityError)).ToList()
            });
        }

        // Assign User role to newly created user
        var roles = new[] { ApplicationRoles.User };
        var assignRolesResult = await _userManager.AddToRolesAsync(user, roles);
        if (assignRolesResult != IdentityResult.Success) 
            return BadRequest(new Response<object>
            {
                Status = StatusCodes.Status400BadRequest,
                Errors = assignRolesResult.Errors.Select(identityError => new ErrorResponse().Parse(identityError)).ToList()
            });

        // Send confirmation email
        await SendConfirmationEmail(user);

        return Ok();
    }

    // TODO: Send confirmation email
    // Temporarily confirm email automatically
    private async Task SendConfirmationEmail(ApplicationUser user)
    {
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        // !!!!!!!!!!!! FIXME !!!!!!!!!!!!
        if (user.Email != null) await ConfirmEmail(token, user.Email);
        // !!!!!!!!!!!! FIXME !!!!!!!!!!!!
    }

    [HttpGet]
    [Route("ConfirmEmail")]
    public async Task<IActionResult> ConfirmEmail(string token, string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return BadRequest();
        var result = await _userManager.ConfirmEmailAsync(user, token);
        return result.Succeeded ? Ok(nameof(ConfirmEmail)) : BadRequest(result.Errors);
    }

    private static ErrorResponse DeclinedTermsError()
    {
        return new ErrorResponse
        {
            Code = "AcceptedTerms",
            Description = "You must accept the terms and conditions"
        };
    }

    private static ErrorResponse UserExistsError()
    {
        return new ErrorResponse
        {
            Code = "UserExists",
            Description = "User already exists"
        };
    }
}