﻿using System.ComponentModel.DataAnnotations;

namespace TicketSlave.Classes
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
        public ICollection<string> ImageUrls { get; set; }
        public DateTime EventStartAt { get; set; }
        public DateTime EventEndAt { get; set; }
        public DateTime SaleStartAt { get; set; }
        public DateTime SaleEndAt { get; set; }
        public DateTime PresaleStartAt { get; set; }
        public DateTime PresaleEndAt { get; set; }
        public DateTime PresalePasswordHash { get; set; }
        public Visibility Visibility { get; set; } = Visibility.Hidden;
    }

    public enum Visibility
    {
        Visible,
        Hidden
    }
}
