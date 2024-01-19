using System.ComponentModel.DataAnnotations;

namespace webapi.Classes
{
    public class EventDto
    {
        [Key]
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
        public Visibility Visibility { get; set; }
        public int AvailableSeats { get; set; }
        public int TotalSeats { get; set; }
        public double? LowestPrice { get; set; }

        public static EventDto FromEvent(Event @event)
        {
            return new EventDto
            {
                Id = @event.Id,
                Title = @event.Title,
                Description = @event.Description,
                LocationId = @event.LocationId,
                CreatedAt = @event.CreatedAt,
                CreatedBy = @event.CreatedBy,
                ImageUrls = @event.ImageUrls,
                EventEndAt = @event.EventEndAt,
                EventStartAt = @event.EventStartAt,
                SaleEndAt = @event.SaleEndAt,
                SaleStartAt = @event.SaleStartAt,
                PresaleEndAt = @event.PresaleEndAt,
                PresaleStartAt = @event.PresaleStartAt,
                Visibility = @event.Visibility
            };
        }
    }

}