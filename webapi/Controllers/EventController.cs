using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using webapi.Classes;

namespace webapi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class EventController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventController(AppDbContext context)
    {
        _context = context;
    }

    // TODO: Add pagination
    [HttpGet]
    public async Task<ActionResult<List<Event>>> GetAllEvents()
    {
        var foundedEvents = await _context.Events
            .Where(e => e.Visibility == Visibility.Visible)
            .Select(x => EventDto.FromEvent(x))
            .ToListAsync();
        var eventIds = foundedEvents.Select(e => e.Id).ToList();
        var eventSeats = await _context.EventSeats.Where(s => eventIds.Contains(s.EventId)).ToListAsync();
        foreach (var e in foundedEvents)
        {
            e.AvailableSeats =
                eventSeats.Count(s => s.EventId == e.Id && s.Status == EventSeatStatus.Available);
            e.TotalSeats = eventSeats.Count(s => s.EventId == e.Id);

            var availableSeats = eventSeats
                .Where(s => s.EventId == e.Id && s.Status == EventSeatStatus.Available).ToList();

            if (availableSeats.Any())
            {
                e.LowestPrice = availableSeats.Min(s => s.Price);
            }
            else
            {
                e.LowestPrice = null; // Assign null if no available seats
            }
        }

        return Ok(foundedEvents);
    }

    [HttpGet]
    [Route("active")]
    public async Task<ActionResult<List<EventDto>>> GetActiveEvents()
    {
        var foundedEvents = await _context.Events
            .Where(e => e.SaleStartAt < DateTime.UtcNow && e.SaleEndAt > DateTime.UtcNow &&
                        e.Visibility == Visibility.Visible)
            .Select(x => EventDto.FromEvent(x))
            .ToListAsync();
        return Ok(foundedEvents);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Event>> GetEventById(Guid id)
    {
        var foundedEvent = await _context.Events.Include(events => events.Location)
            .FirstOrDefaultAsync(e => e.Id == id);
        if (foundedEvent == null) return NotFound();
        return Ok(foundedEvent);
    }

    [HttpPost]
    [Authorize(Roles = ApplicationRoles.Admin)]
    public async Task<ActionResult<Event>> CreateEvent([FromBody] EventDto @event)
    {
        var location = await _context.Locations.FindAsync(@event.LocationId);
        if (location == null) return NotFound(ResponseResult.LocationNotFoundError);

        var newEvent = Event.FromEventDto(@event);
        newEvent.Location = location;
        newEvent.LocationId = location.Id;
        
        var locationSeats = _context.Seats.Where(seats => seats.LocationId == location.Id).ToList();
        foreach (var seat in locationSeats)
        {
            var eventSeat = new EventSeat
            {
                Event = newEvent,
                EventId = newEvent.Id,
                Seat = seat,
                SeatId = seat.Id,
                Status = EventSeatStatus.Available,
                Price = 999999999999999999 // TODO REPLACE ME WITH DEFAULT ZONE OR SEAT PRICE
            };
            _context.EventSeats.Add(eventSeat);
        }
        try
        {
            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, ResponseResult.FailedToAddObjectError);
        }

        return Ok(newEvent);
    }

    [HttpGet]
    [Route("{id:guid}/seats")]
    public async Task<ActionResult<List<EventSeat>>> GetEventSeats(Guid id)
    {
        var foundedEvent = await _context.Events.FindAsync(id);
        if (foundedEvent == null) return NotFound();

        var eventSeats = _context.EventSeats
            .Include(eventSeat => eventSeat.Seat)
            .Where(eventSeat => eventSeat.EventId == id);

        return Ok(eventSeats);
    }
    
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = ApplicationRoles.Admin)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var foundedEvent = await _context.Events.FindAsync(id);
        if (foundedEvent == null) return NotFound();

        try
        {
            _context.Events.Remove(foundedEvent);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(500, ResponseResult.FailedToDeleteObjectError);
        }

        return Ok();
    }
}