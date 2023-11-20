using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using TicketSlave.Classes;

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
        test.Description = "Test";
        test.ImageUrls = new List <string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };

        Event test_wee = new Event();
        test_wee.Id = Guid.NewGuid();
        test_wee.Title = "Test twee";
        test_wee.Description = "Test twee";
        test_wee.ImageUrls = new List<string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };

        Event test_drie = new Event();
        test_drie.Id = Guid.NewGuid();
        test_drie.Title = "Test drie";
        test_drie.Description = "Test drie";
        test_drie.ImageUrls = new List<string> { "https://th.bing.com/th/id/OIP.wbjIIP8bQudTnShXyFymDgHaE8?rs=1&pid=ImgDetMain" };
        events.Add(test); 
        events.Add(test_wee); 
        events.Add(test_drie);
        return events;

    }
}

