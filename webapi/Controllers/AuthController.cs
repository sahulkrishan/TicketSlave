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
}
