using System;
using System.ComponentModel.DataAnnotations;
using Stripe;

namespace webapi.Classes
{
    public class Ticket
    {
        [Key] [Required] public Guid Id { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public Guid EventSeatId { get; set; }
        public EventSeat EventSeat { get; set; }
        public bool IsValid { get; set; }
        public DateTime ValidUntil { get; set; }
        public InvalidationReason? InvalidationReason { get; set; }
    }
}