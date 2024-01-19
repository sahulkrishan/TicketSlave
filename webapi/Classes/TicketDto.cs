using System;
using System.ComponentModel.DataAnnotations;
using Stripe;

namespace webapi.Classes
{
    public class TicketDto
    {
        [Key] [Required] public Guid Id { get; set; }
        public string UserId { get; set; }
        public Guid EventSeatId { get; set; }
        public EventSeat EventSeat { get; set; }
        public bool IsValid { get; set; }
        public DateTime ValidUntil { get; set; }
        public InvalidationReason? InvalidationReason { get; set; }

        public static TicketDto From(Ticket ticket)
        {
            return new TicketDto
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                EventSeatId = ticket.EventSeatId,
                EventSeat = ticket.EventSeat,
                IsValid = ticket.IsValid,
                ValidUntil = ticket.ValidUntil,
                InvalidationReason = ticket.InvalidationReason
            };
        }
    }
}