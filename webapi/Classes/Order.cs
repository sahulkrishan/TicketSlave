using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Classes
{
    public class Order
    {
        [Key] [Required] public Guid Id { get; set; }
        public string UserId { get; set; }
        [Required] public ApplicationUser User { get; set; }
        [Required] public DateTime OrderedAt { get; set; }
        [Required] public long? Price { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
        public OrderStatus Status { get; set; }
        public string? StripeSessionId { get; set; }
        public string? StripePaymentIntentId { get; set; }
        [ForeignKey("Voucher")] public Guid? VoucherId { get; set; }
        public Voucher? Voucher { get; set; }
    }
}