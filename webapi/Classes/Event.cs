using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using webapi.Classes;

namespace webapi.Classes
{
    public class Event
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid LocationId { get; set; }
        public Location Location { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<string> ImageUrls { get; set; } = new();
        public DateTime EventStartAt { get; set; }
        public DateTime EventEndAt { get; set; }
        public DateTime SaleStartAt { get; set; }
        public DateTime SaleEndAt { get; set; }
        public DateTime PresaleStartAt { get; set; }
        public DateTime PresaleEndAt { get; set; }
        public string? PresaleCode { get; set; }
        public Visibility Visibility { get; set; } = Visibility.Hidden;

        public static Event FromEventDto(EventDto eventDto)
        {
            return new Event
            {
                Title = eventDto.Title,
                Description = eventDto.Description,
                ImageUrls = eventDto.ImageUrls,
                CreatedAt = eventDto.CreatedAt,
                CreatedBy = eventDto.CreatedBy,
                LocationId = eventDto.Id,
                EventEndAt = eventDto.EventEndAt,
                EventStartAt = eventDto.EventStartAt,
                SaleEndAt = eventDto.SaleEndAt,
                SaleStartAt = eventDto.SaleStartAt,
                PresaleStartAt = eventDto.PresaleStartAt,
                PresaleEndAt = eventDto.PresaleEndAt,
                Visibility = eventDto.Visibility,
            };
        }
    }

    public enum Visibility
    {
        Visible,
        Hidden
    }
}
