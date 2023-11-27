using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using TicketSlave.Classes;
using webapi.Classes;
using static System.Net.Mime.MediaTypeNames;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class eventController : ControllerBase
{
    private readonly AppDbContext _context;
    public eventController(AppDbContext context) {  _context = context; }


    [HttpGet]
    public async Task<ActionResult<List<Event>>> GetAllEvents()
    {
        var foundedEvents = await _context.Events.OrderBy(e => e.EventStartAt).ToListAsync();

        if (foundedEvents.Any())
        {
            return Ok(foundedEvents);
        }
        if (foundedEvents == null) { 
            return NotFound();
        }
        return BadRequest();
    }

    [HttpGet("paginator/{id}")]
    public async Task<ActionResult<List<Event>>> getPageEvents(string indexId, [FromQuery] string direction)
    {
        Guid resultGuid;
        if (Guid.TryParse(indexId, out resultGuid))
        {
            //return
        }

        var foundedEvents = await _context.Events.OrderBy(e => e.EventStartAt).ToListAsync();

        if (foundedEvents.Any())
        {
            return Ok(foundedEvents);
        }
        if (foundedEvents == null)
        {
            return NotFound();
        }
        return BadRequest();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetEventById(string id)
    {
        Guid resultGuid;
        if (Guid.TryParse(id, out resultGuid))
        {
           var foundedEvent =  await _context.Events.FindAsync(resultGuid);
            if (foundedEvent != null)
            {
                return Ok(foundedEvent);
            }
        }
        return BadRequest();
    }

    [HttpPost]
    public async Task<ActionResult<Event>> createEvent([FromBody] EventDTO evenement) {

        if (evenement == null)
        {
            return NotFound();
            
        }
        var location = await _context.Locations.FindAsync(evenement.LocationId);
        if (location == null)
        {
            return StatusCode(400, "Location is null");
        }
        var newEvent = new Event() {
            Id = evenement.Id,
            Title = evenement.Title,

            Description = evenement.Description,
            ImageUrls = evenement.ImageUrls,
            CreatedAt = evenement.CreatedAt,
            CreatedBy = evenement.CreatedBy,
            LocationId = location.Id,
            Location = location,
            EventEndAt = evenement.EventEndAt,
            EventStartAt    = evenement.EventStartAt,
            SaleEndAt   = evenement.SaleEndAt,
            SaleStartAt = evenement.SaleStartAt,
            PresaleStartAt = evenement.PresaleStartAt,
            PresaleEndAt = evenement.PresaleEndAt,
            PresalePasswordHash = evenement.PresalePasswordHash,
            Visibility = evenement.Visibility,
        };
        _context.Events.Add(newEvent);
        try
        {
            await _context.SaveChangesAsync();
            return Ok(newEvent);

        }
        catch (DbUpdateConcurrencyException)
        {
            return StatusCode(400, "Evenement maken is mislukt");
        }

    }

    [HttpDelete]

    public async Task<ActionResult> delete()
    {

        var events = await _context.Events.ToListAsync();
        _context.RemoveRange(events);
        await _context.SaveChangesAsync();
        return Ok("nice");

    }

    [HttpDelete("{id}")]

    public async Task<ActionResult> delete(string id) {
        Guid resultGuid;
        if (Guid.TryParse(id, out resultGuid))
        {
            var foundedEvent = await _context.Events.FindAsync(resultGuid);
            if (foundedEvent != null)
            {
                try
                {
                    _context.Events.Remove(foundedEvent);
                    await _context.SaveChangesAsync();
                    var deletedEvent = await _context.Events.FindAsync(resultGuid);
                    if (deletedEvent == null) {
                        return Ok(new { message = "Event deleted successfully" });
                    }
                    return StatusCode(400, "Het evenement is niet succesvol gedelete, hij returned niet null");
                }
                catch (DbUpdateConcurrencyException)
                {
                    return StatusCode(400, "Evenement deleten is mislukt");
                }
            }
            return StatusCode(400, "De Id wordt niet gevonden");
        }
        return BadRequest("parsing");

    }
}

