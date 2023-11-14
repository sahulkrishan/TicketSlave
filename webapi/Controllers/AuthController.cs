using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Classes;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace webapi.Controllers;

[ApiController]
[Route("/api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthController(
        AppDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        SignInManager<ApplicationUser> signInManager) {
        _context = context;
        _userManager = userManager;
        _roleManager = roleManager;
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
            return Ok();
        }
        
        return Unauthorized(signInResult);
    }
    
    
    [HttpPost]
    [Route("Register")]
    public async Task<ActionResult> Register([FromBody] RegisterModel registerModel)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var userExists = await _userManager.FindByNameAsync(registerModel.Email);
        if (userExists != null)
            return BadRequest("User already exists.");
        
        var user = new ApplicationUser
        {
            FirstName = registerModel.FirstName,
            LastName = registerModel.LastName,
            Email = registerModel.Email,
            UserName = registerModel.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
        };
        
        var result = await _userManager.CreateAsync(user, registerModel.Password);
        
        // Assign User role to newly created user
        var roles = new [] { ApplicationRoles.User };
        var assignRolesResult = await _userManager.AddToRolesAsync(user, roles);
        if (assignRolesResult != IdentityResult.Success) return BadRequest();
        
        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        return result.Succeeded ? Ok(token) : BadRequest(result.Errors);
    }
    
    // [HttpPost]
    // [Route("register")]
    // [Authorize(ApplicationRoles.Admin)]
    // public async Task<ActionResult> Register([FromBody] RegisterModel registerModel, List<string> roles)
    // {
    //     if (!ModelState.IsValid) return BadRequest(ModelState);
    //     var userExists = await _userManager.FindByNameAsync(registerModel.Email);
    //     if (userExists != null)
    //         return BadRequest("User already exists.");
    //     
    //     var user = new ApplicationUser
    //     {
    //         FirstName = registerModel.FirstName,
    //         LastName = registerModel.LastName,
    //         Email = registerModel.Email,
    //         UserName = registerModel.Email,
    //         SecurityStamp = Guid.NewGuid().ToString(),
    //     };
    //     
    //     var result = await _userManager.CreateAsync(user, registerModel.Password);
    //     
    //     // Assign roles to newly created user
    //     var assignRolesResult = await _userManager.AddToRolesAsync(user, roles);
    //     if (assignRolesResult != IdentityResult.Success) return BadRequest();
    //     
    //     var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
    //     return result.Succeeded ? Ok(token) : BadRequest(result.Errors);
    // }
    
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
}
