using System;
using System.ComponentModel.DataAnnotations;

namespace webapi.Classes
{
    public class Ticket
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public string EventSeatId { get; set; }
        public string UserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public string Price { get; set; }
        public bool IsValid { get; set; }
        public DateTime ValidUntil { get; set; }
        public InvalidationReason InvalidationReason { get; set; }

    }
}
