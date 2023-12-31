﻿namespace TicketSlave.Classes
{
    public class Ticket
    {
        public string Id { get; set; }
        public string EventSeatId { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string Price { get; set; }
        public bool IsValid { get; set; }
        public DateTime ValidUntil { get; set; }
        public InvalidationReason InvalidationReason { get; set; }
        public bool IsRedeemed { get; set; }
        public DateTime RedeemedAt { get; set; }
        public string RedeemedBy { get; set; }

    }
}
