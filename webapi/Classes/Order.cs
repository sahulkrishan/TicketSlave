using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography.X509Certificates;

namespace TicketSlave.Classes
{
    public class Order
    {
        [Required]
        public string Id { get; set; }
        [Required]
        public string UserId { get; set; }
        [Required]
        public string OrderedBy { get; set; }
        [Required]
        public DateTime OrderedAt { get; set; }
        [Required]
        public string Price { get; set; }
        public ICollection<Ticket> Tickets { get; set; }
        public string Status { get; set; }
        public string PaymentMethod { get; set; }
        public string TransactionId { get; set; }
        public string LocationId { get; set; }
        public Location Location { get; set; }
        public string VoucherId { get; set; }
        public Voucher Voucher { get; set; }
    }
}
