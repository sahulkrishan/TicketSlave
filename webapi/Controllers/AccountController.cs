using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Classes;

namespace webapi.Controllers;

[ApiController]
[Authorize]
[Route("/api/v1/[controller]")]
public class AccountController: ControllerBase
{
  private readonly AppDbContext _context;
  private readonly UserManager<ApplicationUser> _userManager;
  private readonly SignInManager<ApplicationUser> _signInManager;
  
  public AccountController(
    AppDbContext context,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager)
  {
    _context = context;
    _userManager = userManager;
    _signInManager = signInManager;
  }
  
  [HttpGet]
  [Route("profile")]
  public async Task<ActionResult<UserDto>> GetCurrentUser()
  {
    var user = await _userManager.GetUserAsync(User);
    if (user == null)
      return NotFound();
    var userDto = UserDto.FromApplicationUser(user);
    return Ok(userDto);
  }
}