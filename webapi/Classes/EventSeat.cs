using System.ComponentModel.DataAnnotations;

namespace TicketSlave.Classes
{
    public class EventSeat
    {
        [Key]
        public Guid Id { get; set; }
        public Guid SeatId { get; set; }
        public Seat Seat { get; set; }
        public Guid EventId { get; set; }
        public Event Event { get; set; }
        public EventSeatStatus Status { get; set; }
    }

    public enum EventSeatStatus
    {
        Available,
        Reserved,
        Sold
    }
}
