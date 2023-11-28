using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Security.Cryptography.X509Certificates;
using webapi.Classes;

namespace webapi.Classes
{
    public class Order
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
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
        [ForeignKey("Location")] public Guid LocationId { get; set; }
        public Location Location { get; set; }
        [ForeignKey("Voucher")] public Guid VoucherId { get; set; }
        public Voucher Voucher { get; set; }
    }
}
