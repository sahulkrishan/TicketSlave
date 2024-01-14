using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Classes
{
    public class ReservationSessionDto
    {
        public Guid Id { get; set; }
        public List<EventSeat> EventSeats { get; set; } = new();
        public DateTime ReservedUntil { get; set;}
        public string ReservedById { get; set; }
        
        public static ReservationSessionDto From(ReservationSession reservationSession) => new()
        {
            Id = reservationSession.Id,
            EventSeats = reservationSession.EventSeatList,
            ReservedUntil = reservationSession.ReservedUntil,
            ReservedById = reservationSession.ReservedById
        };
    }
}
