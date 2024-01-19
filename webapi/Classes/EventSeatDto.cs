using System;
using System.ComponentModel.DataAnnotations;
using webapi.Classes;

namespace webapi.Classes
{
    public class EventSeatDto
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public Guid SeatId { get; set; }
        public Seat Seat { get; set; }
        public Guid EventId { get; set; }
        public long Price { get; set; }
        public EventSeatStatus Status { get; set; }
        
        public static EventSeatDto From(EventSeat eventSeat) => new()
        {
            Id = eventSeat.Id,
            SeatId = eventSeat.SeatId,
            Seat = eventSeat.Seat,
            EventId = eventSeat.EventId,
            Price = eventSeat.Price,
            Status = eventSeat.Status
        };
    }
}
