using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using TicketSlave.Classes;
using static System.Net.Mime.MediaTypeNames;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class eventController : ControllerBase
{

    [HttpGet]
    public List<Event> Get()
    {
        List<Event> events = new List<Event>();
        

        Event test = new Event();
        test.Id = Guid.NewGuid();
        test.Title = "Test";
        test.Description = "Test de beschrijving met deze tekst, want beschrijvingen moeten ook getoond worden ds ja dat een beetje";
        test.ImageUrls = new List <string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };

        Event test_wee = new Event();
        test_wee.Id = Guid.NewGuid();
        test_wee.Title = "Test twee";
        test_wee.Description = "Test twee de beschrijving met deze tekst, want beschrijvingen moeten ook getoond worden ds ja dat een beetje";
        test_wee.ImageUrls = new List<string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };

        Event test_drie = new Event();
        test_drie.Id = Guid.NewGuid();
        test_drie.Title = "Test drie";
        test_drie.Description = "Test drie de beschrijving met deze tekst, want beschrijvingen moeten ook getoond worden ds ja dat een beetje";
        test_drie.ImageUrls = new List<string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };
        events.Add(test); 
        events.Add(test_wee); 
        events.Add(test_drie);
        return events;

    }
    [HttpGet("{id}")]
    public ActionResult<IEnumerable<Event>> GetEventById(string id)
    {
        Guid resultGuid;
        if (Guid.TryParse(id, out resultGuid))
        {
            Event test = new Event();
            test.Id = resultGuid;
            test.Title = "succes api with id works";
            test.Description = "Test detail de beschrijving met deze tekst, want beschrijvingen moeten ook getoond worden ds ja dat een beetje";
            test.ImageUrls = new List<string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };
            return Ok(test);
        }
        else
        {
            Event test = new Event();
            test.Id = Guid.NewGuid();
            test.Id = resultGuid;
            test.Title = "succes api with id works";
            test.Description = "Test";
            test.ImageUrls = new List<string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };
            // The input string was not in a valid GUID format
            return Ok(test);
        }

        
    }
}

