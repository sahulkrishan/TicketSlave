using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Classes
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public DateTime OrderedAt { get; set; }
        public long? Price { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
        public OrderStatus Status { get; set; }
        public string? StripeSessionId { get; set; }
        public string? StripePaymentIntentId { get; set; }
        [ForeignKey("Voucher")] public Guid? VoucherId { get; set; }
        public Voucher? Voucher { get; set; }

        public static OrderDto From(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                OrderedAt = order.OrderedAt,
                Price = order.Price,
                Tickets = order.Tickets,
                Status = order.Status,
                StripeSessionId = order.StripeSessionId,
                StripePaymentIntentId = order.StripePaymentIntentId,
                VoucherId = order.VoucherId,
                Voucher = order.Voucher
            };
        }
    }
}