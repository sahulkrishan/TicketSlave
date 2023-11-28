using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Classes;

namespace webapi.Controllers;

public class BaseController: ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public BaseController(
        AppDbContext context,
        UserManager<ApplicationUser> userManager
    ) {
        _context = context;
        _userManager = userManager;
    }
}