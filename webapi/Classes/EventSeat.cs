using System.ComponentModel.DataAnnotations;
using webapi.Classes;

namespace TicketSlave.Classes
{
    public class EventSeat
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public Guid SeatId { get; set; }
        public Seat Seat { get; set; }
        public Guid EventId { get; set; }
        public Event Event { get; set; }
        public Double Price { get; set; }
        public EventSeatStatus Status { get; set; }
    }
}
