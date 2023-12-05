using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using webapi.Classes;
using static System.Net.Mime.MediaTypeNames;

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
        
        foreach (var e in foundedEvents)
        {
            e.AvailableSeats = _context.EventSeats.Count(s => s.EventId == e.Id && s.Status == EventSeatStatus.Available);
            e.TotalSeats = _context.EventSeats.Count(s => s.EventId == e.Id);
            
            var availableSeats = _context.EventSeats.Where(s => s.EventId == e.Id && s.Status == EventSeatStatus.Available).ToList();
    
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
            .Where(e => e.SaleStartAt < DateTime.UtcNow && e.SaleEndAt > DateTime.UtcNow && e.Visibility == Visibility.Visible)
            .Select(x => EventDto.FromEvent(x))
            .ToListAsync();
        return Ok(foundedEvents);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Event>> GetEventById(Guid id)
    {
        var foundedEvent = await _context.Events.FindAsync(id);
        if (foundedEvent == null) return NotFound();
        return Ok(foundedEvent);
    }

    [HttpPost]
    [Authorize(Roles=ApplicationRoles.Admin)]
    public async Task<ActionResult<Event>> CreateEvent([FromBody] EventDto @event)
    {
        var location = await _context.Locations.FindAsync(@event.LocationId);
        if (location == null) return NotFound(ResponseResult.LocationNotFoundError);
        
        var newEvent = new Event
        {
            Id = @event.Id,
            Title = @event.Title,
            Description = @event.Description,
            ImageUrls = @event.ImageUrls,
            CreatedAt = @event.CreatedAt,
            CreatedBy = @event.CreatedBy,
            LocationId = location.Id,
            Location = location,
            EventEndAt = @event.EventEndAt,
            EventStartAt = @event.EventStartAt,
            SaleEndAt = @event.SaleEndAt,
            SaleStartAt = @event.SaleStartAt,
            PresaleStartAt = @event.PresaleStartAt,
            PresaleEndAt = @event.PresaleEndAt,
            PresaleCode = @event.PresaleCode,
            Visibility = @event.Visibility,
        };
        
        try
        {
            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode (500, ResponseResult.FailedToAddObjectError);
        }
        
        return Ok(newEvent);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles=ApplicationRoles.Admin)]
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