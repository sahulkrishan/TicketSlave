using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Classes
{
    public class ReservationSession
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public List<EventSeat> EventSeatList { get; set; } = new();
        public DateTime ReservedUntil { get; set;}
        [ForeignKey("ReservedBy")] public string ReservedById { get; set; }
        public ApplicationUser ReservedBy { get; set;}
        public string? StripeSessionId { get; set;}
    }
}
