using Hangfire;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Classes;

namespace webapi.Controllers;

[ApiController]
[Authorize]
[Route("/api/v1/[controller]")]
public class CartController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private const int ReservationSessionTimeout = 15; // seconds

    public CartController(AppDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<ActionResult<Cart>> AddToCart(Guid eventSeatId, string? presaleCode)
    {
        var user = await _userManager
            .Users
            .Include(usr => usr.ReservationSession)
            .ThenInclude(session => session.EventSeatList)
            .FirstOrDefaultAsync(usr => usr.Id == _userManager.GetUserId(User));
        if (user == null)
            return NotFound(new List<ResponseResult>
                { ResponseResult.UserNotFoundError }
            );

        var eventSeat = await _context.EventSeats
            .Include(eventSeat => eventSeat.Event)
            .Include(eventSeat => eventSeat.Seat)
            .FirstOrDefaultAsync(eventSeat => eventSeat.Id == eventSeatId);

        if (eventSeat == null)
        {
            return NotFound(new List<ResponseResult>
                { ResponseResult.EventSeatNotFoundError }
            );
        }

        var eventList = new List<EventSeat>();
        if (user.ReservationSession == null)
        {
            var reservedUntil = DateTime.UtcNow.AddSeconds(ReservationSessionTimeout);
            // No reservation session or expired
            user.ReservationSession = new ReservationSession
            {
                EventSeatList = eventList,
                ReservedUntil = reservedUntil,
                ReservedBy = user
            };
        }
        else
        {
            // Reservation session exists 
            DateTime reservedUntil;
            if (user.ReservationSession.ReservedUntil >= DateTime.UtcNow)
            {
                eventList = user.ReservationSession.EventSeatList;
                reservedUntil = user.ReservationSession.ReservedUntil;
            }
            else
            {
                reservedUntil = DateTime.UtcNow.AddSeconds(ReservationSessionTimeout);
            }
            user.ReservationSession.ReservedUntil = reservedUntil;
            _context.Entry(user.ReservationSession).State = EntityState.Modified;
        }
        switch (eventSeat.Status)
        {
            case EventSeatStatus.Sold:
                return BadRequest(new List<ResponseResult>
                    { ResponseResult.EventSeatUnavailableError }
                );
            case EventSeatStatus.Reserved:
                // TODO NOT SURE WHAT TO DO HERE, CHECK IF USER IS THE SAME?
                if (user.ReservationSession.EventSeatList.Contains(eventSeat)) {
                    break;
                }
                
                return NotFound(new List<ResponseResult>
                    { ResponseResult.EventSeatReservedError }
                );
            case EventSeatStatus.Available:
                if (!string.IsNullOrEmpty(eventSeat.Event.PresaleCode) && eventSeat.Event.PresaleCode != presaleCode)
                {
                    return NotFound(new List<ResponseResult>
                        { ResponseResult.InvalidPresaleCodeError }
                    );
                }

                eventList.Add(eventSeat);
                eventSeat.Status = EventSeatStatus.Reserved;
                _context.Entry(eventSeat).State = EntityState.Modified;
                break;
            default:
                return NotFound(new List<ResponseResult>
                    { ResponseResult.EventSeatUnavailableError }
                );
        }
        
        await _context.SaveChangesAsync();
        
        // If the user does not complete the reservation within the timeout, the tickets will be released
        BackgroundJob.Schedule(() => InvalidateReservationSession(user.ReservationSession.Id), user.ReservationSession.ReservedUntil);

        
        return Ok(Cart.From(user.ReservationSession));
    }

    [HttpGet]
    public async Task<ActionResult<Cart>> GetCart()
    {
        var user = await _userManager
            .Users
            .Include(usr => usr.ReservationSession)
            .ThenInclude(session => session.EventSeatList)
            .ThenInclude(eventSeat => eventSeat.Event)
            .Include(usr => usr.ReservationSession)
            .ThenInclude(session => session.EventSeatList)
            .ThenInclude(eventSeat => eventSeat.Seat)
            .FirstOrDefaultAsync(usr => usr.Id == _userManager.GetUserId(User));
        if (user == null)
            return BadRequest(new List<ResponseResult>
                { ResponseResult.UserNotFoundError }
            );

        if (user.ReservationSession == null) return NotFound();
        if (user.ReservationSession.ReservedUntil < DateTime.UtcNow)
        {
            await InvalidateReservationSession(user.ReservationSession.Id);
            return NotFound();
        }

        return Ok(Cart.From(user.ReservationSession));
    }

    [HttpDelete]
    public async Task<ActionResult> RemoveFromCart(Guid eventSeatId)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new List<ResponseResult>
                { ResponseResult.UserNotFoundError }
            );

        if (user.ReservationSession != null)
        {
            var eventSeat =
                user.ReservationSession.EventSeatList.FirstOrDefault(eventSeat => eventSeat.Id == eventSeatId);

            if (eventSeat == null)
                return NotFound(new List<ResponseResult>
                    { ResponseResult.EventSeatNotFoundError }
                );
            eventSeat.Status = EventSeatStatus.Available;
            _context.Entry(eventSeat).State = EntityState.Modified;
            user.ReservationSession.EventSeatList.Remove(eventSeat);
            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    [Route("clear")]
    [HttpDelete]
    public async Task<ActionResult> ClearCart()
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new List<ResponseResult>
                { ResponseResult.UserNotFoundError }
            );

        if (user.ReservationSession != null)
        {
            await InvalidateReservationSession(user.ReservationSession.Id);
        }

        return Ok();
    }

    [NonAction]
    [AutomaticRetry(Attempts = 3)]
    public async Task InvalidateReservationSession(Guid reservationSessionId)
    {
        var reservationSession = _context.ReservationSessions.Where(session => session.Id == reservationSessionId)
            .Include(session => session.EventSeatList)
            .FirstOrDefault();
        if (reservationSession == null) throw new Exception("Reservation session not found");
        if (reservationSession.StripeSessionId != null)
        {
            var service = new Stripe.Checkout.SessionService();
            await service.ExpireAsync(reservationSession.StripeSessionId);
        }
        foreach (var eventSeat in reservationSession.EventSeatList)
        {
            eventSeat.Status = EventSeatStatus.Available;
            _context.Entry(eventSeat).State = EntityState.Modified;
        }
        _context.ReservationSessions.Remove(reservationSession);
        await _context.SaveChangesAsync();
    }
}