using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TicketSlave.Classes;
using webapi.Classes;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class locationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public locationController(AppDbContext context) { _context = context; }

        // GET: api/<locationController>
        [HttpGet]
        public async Task<ActionResult<Location[]>> GetLocations()
        {
            var list = await _context.Locations.ToListAsync();
            if (list != null) {
                return Ok(list);
            }
            return NotFound();
        }

        // GET api/<locationController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<locationController>
        [HttpPost]
        public async Task<ActionResult<Event>> createLocation([FromBody] Location location)
        {
            if (location != null && location.PostalCode != null && location.EmailAddress != null && location.Country != null && location.City != null)
            {
                _context.Locations.Add(location);
                await _context.SaveChangesAsync();
                return Ok(location);
            }
            return BadRequest("Location is null");
        }

        // PUT api/<locationController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<locationController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            Guid resultGuid;
            if (Guid.TryParse(id, out resultGuid))
            {
                var foundedLocation = await _context.Locations.FindAsync(resultGuid);
                if (foundedLocation != null)
                {
                    try { 
                        _context.Locations.Remove(foundedLocation);
                        _context.SaveChanges();
                        return Ok("Location deleted successfully");
                    }
                    catch {
                        return BadRequest("Deleting failed");
                    }
                    
                }
                return NotFound();
            }
            return BadRequest("id parsing failed");
        }
    }
}
