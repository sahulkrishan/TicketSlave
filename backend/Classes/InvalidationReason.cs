namespace TicketSlave.Classes
{
    public enum InvalidationReason
    {
        CustomerServiceCancellation,
        EventCancelled,
        EventModified,
        EventPassed,
        Expired,
        FraudulantActivity,
        Redeemed,
        Refunded,
        UsageLimitReached
    }
}
