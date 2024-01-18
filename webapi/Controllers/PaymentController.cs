using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe.Checkout;
using webapi.Classes;

namespace webapi.Controllers;

[ApiController]
[Route("/api/v1/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _context;

    public PaymentController(AppDbContext context)
    {
        _context = context;
    }

    [Route("createCheckoutSession")]
    [HttpPost]
    public async Task<ActionResult> Create(Guid reservationSessionId)
    {
        // TODO: Replace with actual domain
        var domain = "https://localhost:4200" + $"/checkout";

        var reservationSession = await _context.ReservationSessions
            .Include(session => session.EventSeatList)
            .ThenInclude(eventSeat => eventSeat.Event)
            .Include(session => session.EventSeatList)
            .ThenInclude(eventSeat => eventSeat.Seat)
            .FirstOrDefaultAsync(session => session.Id == reservationSessionId);

        if (reservationSession == null)
        {
            throw new NotImplementedException();
        }

        if (!reservationSession.EventSeatList.Any())
        {
            throw new NotImplementedException();
        }

        List<SessionLineItemOptions> sessionLineItemOptionsList = new();
        foreach (var eventSeat in reservationSession.EventSeatList)
        {
            sessionLineItemOptionsList.Add(new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = eventSeat.Price,
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = eventSeat.Seat.Name,
                        Description = eventSeat.Event.Title,
                        Images = eventSeat.Event.ImageUrls,
                    },
                    Currency = "eur",
                },
                Quantity = 1,
            });
        }

        var options = new SessionCreateOptions
        {
            LineItems = sessionLineItemOptionsList,
            Mode = "payment",
            SuccessUrl = domain + "?success=true",
            CancelUrl = domain + "?canceled=true"
        };
        var service = new SessionService();
        var session = await service.CreateAsync(options);
        
        reservationSession.StripeSessionId = session.Id;
        _context.Entry(reservationSession).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(session.Id);
    }
}