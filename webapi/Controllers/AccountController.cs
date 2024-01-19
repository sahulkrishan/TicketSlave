using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Classes;

namespace webapi.Controllers;

[ApiController]
[Authorize]
[Route("/api/v1/[controller]")]
public class AccountController : ControllerBase
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
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound();
        var roles = await _userManager.GetRolesAsync(user);
        var userDto = UserDto.FromApplicationUser(user, roles.ToArray());
        return Ok(userDto);
    }

    [HttpPut]
    public async Task<ActionResult<UserDto>> UpdateCurrentUser([FromBody] UserDto userDto)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound();
        user.FirstName = userDto.FirstName;
        user.LastName = userDto.LastName;
        await _userManager.UpdateAsync(user);
        return Ok();
    }

    [HttpGet]
    [Route("Orders")]
    public ActionResult<List<OrderDto>> GetOrders()
    {
        var orders = _context.Orders
            .Where(order => order.UserId == _userManager.GetUserId(User))
            .Include(order => order.Tickets)
            .ThenInclude(ticket => ticket.EventSeat)
            .ThenInclude(eventSeat => eventSeat.Event)
            .Include(order => order.Tickets)
            .ThenInclude(ticket => ticket.EventSeat)
            .ThenInclude(eventSeat => eventSeat.Seat)
            .Select(OrderDto.From)
            .OrderByDescending(x => x.OrderedAt)
            .ToList();
        return orders;
    }

    [HttpGet]
    [Route("Orders/{orderId:guid}")]
    public async Task<ActionResult<OrderDto>> GetOrder(Guid orderId)
    {
        var order = await _context.Orders
            .Where(order => order.Id == orderId)
            .Include(order => order.Tickets)
            .ThenInclude(ticket => ticket.EventSeat)
            .ThenInclude(eventSeat => eventSeat.Event)
            .Include(order => order.Tickets)
            .ThenInclude(ticket => ticket.EventSeat)
            .ThenInclude(eventSeat => eventSeat.Seat)
            .SingleOrDefaultAsync();
        if (order == null)
            return NotFound();
        return OrderDto.From(order);
    }

    [HttpPost]
    [Route("Logout")]
    public async Task<ActionResult<ResponseResult>> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }
}