using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Classes
{
    public class CartItem
    {
        public EventDto Event { get; set; }
        public List<EventSeatDto> SelectedEventSeats { get; set; } = new();
    }
}
