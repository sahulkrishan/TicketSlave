namespace webapi.Classes;

public enum InvalidationReason
{
    AwaitingPayment,
    EventCancelled,
    EventModified,
    Expired,
    Redeemed,
    OrderCancelled,
    UsageLimitReached
}