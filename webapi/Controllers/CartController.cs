using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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
    private const int ReservationSessionTimeout = 100; // minutes

    public CartController(AppDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpPost]
    [Route("createReservation")]
    public async Task<ActionResult> CreateReservation(List<Guid> eventSeatIds)
    {
        var eventSeats = _context.EventSeats
            .Include(eventSeat => eventSeat.Event)
            .Include(eventSeat => eventSeat.Seat)
            .Where(eventSeat => eventSeatIds.Contains(eventSeat.Id));

        if (!eventSeats.Any())
        {
            return NotFound(new List<ResponseResult>
                { ResponseResult.EventSeatNotFoundError }
            );
        }

        var user = await _userManager.GetUserAsync(User);
        if (user == null)
            return NotFound(new List<ResponseResult>
                { ResponseResult.UserNotFoundError }
            );

        List<EventSeat> reservationEventSeats = new();
        foreach (var eventSeat in eventSeats)
        {
            switch (eventSeat.Status)
            {
                case EventSeatStatus.Sold:
                    return BadRequest(new List<ResponseResult>
                        { ResponseResult.EventSeatUnavailableError }
                    );
                case EventSeatStatus.Reserved:
                    // TODO NOT SURE WHAT TO DO HERE
                    return NotFound(new List<ResponseResult>
                        { ResponseResult.EventSeatUnavailableError }
                    );
                case EventSeatStatus.Available:
                    reservationEventSeats.Add(eventSeat);
                    eventSeat.Status = EventSeatStatus.Reserved;
                    _context.Entry(eventSeat).State = EntityState.Modified;
                    break;
                default:
                    return NotFound(new List<ResponseResult>
                        { ResponseResult.EventSeatUnavailableError }
                    );
            }
        }

        var reservationSession = new ReservationSession
        {
            EventSeatList = reservationEventSeats,
            ReservedUntil = DateTime.UtcNow.AddMinutes(ReservationSessionTimeout),
            ReservedBy = user
        };
        _context.ReservationSessions.Add(reservationSession);
        await _context.SaveChangesAsync();
        return Ok(reservationSession);
    }

    [HttpPost]
    public async Task<ActionResult<ReservationSessionDto>> AddToCart(Guid eventSeatId, string? presaleCode)
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
            // No reservation session or expired
            user.ReservationSession = new ReservationSession
            {
                EventSeatList = eventList,
                ReservedUntil = DateTime.UtcNow.AddMinutes(ReservationSessionTimeout),
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
                reservedUntil = DateTime.UtcNow.AddMinutes(ReservationSessionTimeout);
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
                // if (eventSeat.Event.PresaleCode != null && eventSeat.Event.PresaleCode != presaleCode)
                // {
                //     return NotFound(new List<ResponseResult>
                //         { ResponseResult.EventSeatNotFoundError }
                //     );
                // }

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
        
        return Ok(ReservationSessionDto.From(user.ReservationSession));
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
            return NotFound(new List<ResponseResult>
                { ResponseResult.UserNotFoundError }
            );

        if (user.ReservationSession == null) return NotFound();
        if (user.ReservationSession.ReservedUntil < DateTime.UtcNow)
        {
            _context.ReservationSessions.Remove(user.ReservationSession);
            await _context.SaveChangesAsync();
            return NotFound(new List<ResponseResult>
                { ResponseResult.ReservationSessionExpiredError }
            );
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
            foreach (var eventSeat in user.ReservationSession.EventSeatList)
            {
                eventSeat.Status = EventSeatStatus.Available;
                _context.Entry(eventSeat).State = EntityState.Modified;
            }

            _context.ReservationSessions.Remove(user.ReservationSession);
            await _context.SaveChangesAsync();
        }

        return Ok();
    }
}