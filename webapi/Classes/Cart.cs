namespace webapi.Classes
{
  public class Cart
  {
    public Guid ReservationSessionId { get; set; }
    public List<CartItem> Items { get; set; } = new();
    public DateTime ReservedUntil { get; set; }

    public static Cart From(ReservationSession reservationSession)
    {
      var items = reservationSession.EventSeatList
        .GroupBy(seat => seat.Event)
        .Select(group => new CartItem
        {
          Event = EventDto.FromEvent(group.Key),
          SelectedEventSeats = group.Select(EventSeatDto.From).ToList()
        })
        .ToList();
      return new Cart
      {
        ReservationSessionId = reservationSession.Id,
        Items = items,
        ReservedUntil = reservationSession.ReservedUntil
      };
    }
  }
}