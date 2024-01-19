using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using webapi.Classes;

namespace webapi.Controllers;

[ApiController]
[Route("/api/v1/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public PaymentController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [Route("createCheckoutSession")]
    [HttpPost]
    [Authorize]
    public async Task<ActionResult> CreateCheckoutSession(Guid reservationSessionId)
    {
        // TODO: Replace with actual domain
        var domain = "https://localhost:4200" + $"/checkout";

        var reservationSession = await _context.ReservationSessions
            .Include(session => session.EventSeatList)
            .ThenInclude(eventSeat => eventSeat.Event)
            .Include(session => session.EventSeatList)
            .ThenInclude(eventSeat => eventSeat.Seat)
            .Include(session => session.ReservedBy)
            .FirstOrDefaultAsync(session => session.Id == reservationSessionId);

        if (reservationSession == null)
            throw new Exception("ReservationSession not found");

        if (!reservationSession.EventSeatList.Any())
            throw new Exception("ReservationSession does not contain any eventSeats");

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
            CancelUrl = domain + "?canceled=true",
            CustomerEmail = reservationSession.ReservedBy.Email,
            // UiMode = "embedded",
            Metadata = new Dictionary<string, string>
            {
                { "reservationSessionId", reservationSessionId.ToString() },
                { "userId", reservationSession.ReservedById }
            },
        };
        var service = new SessionService();
        var session = await service.CreateAsync(options);

        reservationSession.StripeSessionId = session.Id;
        _context.Entry(reservationSession).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return Ok(session.Id);
    }

    [HttpPost]
    public async Task<IActionResult> Index()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var header = Request.Headers["Stripe-Signature"];

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"].ToString(),
                _config["Stripe:WebhookSecret"]
            );
            var session = (stripeEvent.Data.Object as Session)!;

            switch (stripeEvent.Type)
            {
                case Events.CheckoutSessionCompleted:
                    // Save an order in your database, marked as 'awaiting payment'
                    await CreateOrder(session);

                    // Check if the order is paid (for example, from a card payment)
                    //
                    // A delayed notification payment will have an `unpaid` status, as
                    // you're still waiting for funds to be transferred from the customer's
                    // account.
                    var orderPaid = session.PaymentStatus == "paid";

                    if (orderPaid)
                    {
                        // Fulfill the purchase
                        await FulfillOrder(session);
                    }

                    break;
                case Events.CheckoutSessionAsyncPaymentSucceeded:
                    // Fulfill the purchase
                    await FulfillOrder(session);

                    break;
                case Events.CheckoutSessionAsyncPaymentFailed:
                    // Send an email to the customer asking them to retry their order
                    await OnPaymentFailed(session);

                    break;
            }

            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest();
        }
    }

    /// <summary>
    /// Checks Stripe's payment status
    /// Should be called periodically to ensure no payments are missed until session has been marked as expired or completed
    /// </summary>
    [NonAction]
    private async Task CheckPaymentStatus(string sessionId)
    {
        var service = new SessionService();
        var session = await service.GetAsync(sessionId);
        var order = await _context.Orders
            .Include(order => order.Tickets)
            .SingleOrDefaultAsync(order => order.StripeSessionId == session.Id);

        if (order == null)
        {
            await CreateOrder(session);
            if (session.PaymentStatus == "paid")
            {
                await FulfillOrder(session);
            }
        }
    }

    /// <summary>
    /// Create and store order
    /// Order and tickets will be marked as 'awaiting payment' and are not valid until payment is completed
    /// </summary>
    private async Task CreateOrder(Session session)
    {
        var reservationSessionId = session.Metadata["reservationSessionId"] ??
                                   throw new Exception("ReservationSessionId metadata not found");
        var reservationSession = _context.ReservationSessions
            .Include(rs => rs.EventSeatList)
            .ThenInclude(eventSeat => eventSeat.Event)
            .FirstOrDefault(rs => rs.Id == Guid.Parse(reservationSessionId));
        if (reservationSession == null) throw new Exception("ReservationSession not found");

        var order = new Order
        {
            StripeSessionId = session.Id,
            StripePaymentIntentId = session.PaymentIntentId,
            OrderedAt = DateTime.UtcNow,
            UserId = reservationSession.ReservedById,
            Price = session.AmountTotal,
            Status = OrderStatus.AwaitingPayment
        };

        foreach (var eventSeat in reservationSession.EventSeatList)
        {
            var ticket = new Ticket
            {
                EventSeat = eventSeat,
                EventSeatId = eventSeat.Id,
                UserId = reservationSession.ReservedById,
                IsValid = false, // IMPORTANT, ticket is not valid until payment is completed
                ValidUntil = eventSeat.Event.EventEndAt,
                InvalidationReason = InvalidationReason.AwaitingPayment
            };
            _context.Tickets.Add(ticket);
            order.Tickets.Add(ticket);
            eventSeat.Status = EventSeatStatus.Sold;
            _context.Entry(eventSeat).State = EntityState.Modified;
        }

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        _context.ReservationSessions.Remove(reservationSession);
        await _context.SaveChangesAsync();
    }

    /// <summary>
    /// Finalize order
    /// This function is called when the payment is completed
    /// Order will be marked as 'succeeded' and tickets will be marked as valid
    /// </summary>
    private async Task FulfillOrder(Session session)
    {
        var order = await _context.Orders
            .Include(order => order.Tickets)
            .SingleAsync(order => order.StripeSessionId == session.Id);
        if (order == null)
            throw new Exception("Order not found");

        // Mark tickets as valid
        foreach (var ticket in order.Tickets)
        {
            ticket.InvalidationReason = null;
            ticket.IsValid = true;
            _context.Entry(ticket).State = EntityState.Modified;
        }

        // Mark order as succeeded
        order.Status = OrderStatus.Succeeded;
        await _context.SaveChangesAsync();
    }


    /// <summary>
    /// Cancel order
    /// This function is called when the payment has failed
    /// Order will be marked as 'PaymentFailed' and all tickets will be invalidated
    /// All EventSeats will be immediately released and available for reservation again
    /// </summary>
    private async Task OnPaymentFailed(Session session)
    {
        var order = _context.Orders.Include(order => order.Tickets).FirstOrDefault(order =>
            order.StripeSessionId == session.Id && order.Status != OrderStatus.Succeeded);
        if (order == null) throw new Exception("Order not found");

        order.Status = OrderStatus.Cancelled;
        _context.Entry(order).State = EntityState.Modified;

        foreach (var orderTicket in order.Tickets)
        {
            orderTicket.IsValid = false;
            orderTicket.InvalidationReason = InvalidationReason.OrderCancelled;
            _context.Entry(orderTicket).State = EntityState.Modified;
        }

        ReleaseEventSeats(order);
        await _context.SaveChangesAsync();
    }

    private void ReleaseEventSeats(Order order)
    {
        foreach (var ticket in order.Tickets)
        {
            ticket.EventSeat.Status = EventSeatStatus.Available;
            _context.Entry(ticket.EventSeat).State = EntityState.Modified;
        }
    }
}