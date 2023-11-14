using System;
using System.ComponentModel.DataAnnotations;

namespace webapi.Classes
{
    public class ReservationSession
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public EventSeat EventSeat { get; set;}
        public DateTime ReserveredUntil { get; set;}
        public User ReservedBy { get; set;}
    }
}
