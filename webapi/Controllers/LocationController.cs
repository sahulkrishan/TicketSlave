﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Classes;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly AppDbContext _context;
        public LocationController(AppDbContext context) { _context = context; }

        // GET: api/<locationController>
        [HttpGet]
        public async Task<ActionResult<Location[]>> GetLocations()
        {
            var list = await _context.Locations.ToListAsync();
            return Ok(list);
        }

        // GET api/<locationController>/5
        [HttpGet("{id:guid}")]
        public string Get(Guid id)
        {
            return "value";
        }

        // POST api/<locationController>
        [HttpPost]
        public async Task<ActionResult<Event>> CreateLocation([FromBody] Location location)
        {
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();
            return Ok(location);
        }

        // PUT api/<locationController>/5
        [HttpPut("{id:guid}")]
        public void Put(Guid id, [FromBody] string value)
        {
        }

        // DELETE api/<locationController>/5
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var foundedLocation = await _context.Locations.FindAsync(id);
            if (foundedLocation == null) return NotFound();
            try { 
                _context.Locations.Remove(foundedLocation);
                await _context.SaveChangesAsync();
            }
            catch {
                return BadRequest("Deleting failed");
            }
            return Ok("Location deleted successfully");
        }
    }
}