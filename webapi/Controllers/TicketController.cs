using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using webapi.Classes;

namespace webapi.Controllers;

[ApiController]
[Authorize]
[Route("/api/v1/[controller]")]
public class TicketController : ControllerBase
{
    private readonly AppDbContext _context;

    public TicketController(
        AppDbContext context)
    {
        _context = context;
    }
    
    [HttpPost]
    [Route("{ticketId:guid}/IsValid")]
    public async Task<ActionResult<bool>> IsValid(Guid ticketId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            return NotFound();
        return Ok(ticket.IsValid && ticket.ValidUntil.Date > DateTime.UtcNow.Date);
    }
    
}