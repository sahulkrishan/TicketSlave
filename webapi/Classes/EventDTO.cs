using System.ComponentModel.DataAnnotations;
using webapi.Classes;

namespace TicketSlave.Classes
{
    public class EventDTO
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid LocationId { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> ImageUrls { get; set; }
        public DateTime EventStartAt { get; set; }
        public DateTime EventEndAt { get; set; }
        public DateTime SaleStartAt { get; set; }
        public DateTime SaleEndAt { get; set; }
        public DateTime PresaleStartAt { get; set; }
        public DateTime PresaleEndAt { get; set; }
        public DateTime PresaleCode { get; set; }
        public Visibility Visibility { get; set; }
    }

}
