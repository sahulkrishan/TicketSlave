using System.ComponentModel.DataAnnotations;

namespace TicketSlave.Classes
{
    public class Voucher
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public string UserId { get; set; }
        [Required]
        public string VoucherType { get; set; }
        [Required]
        public string Value { get; set; }
        [Required]
        public bool IsValid { get; set; }
        [Required]
        public DateTime ValidUntil { get; set; }
        public InvalidationReason InvalidationReason { get; set; }
    }
}
