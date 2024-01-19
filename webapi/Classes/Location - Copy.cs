using System;
using System.ComponentModel.DataAnnotations;

namespace webapi.Classes
{
    public class LocationDTO
    {
        [Key]
        [Required]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public string Website { get; set; }
        public string PhoneNumber { get; set; }
        public string EmailAddress { get; set; }
        public List<ZoneDto> Zones { get; set; }

    }
    public class ZoneDto
    {
        public string ZoneName { get; set; }
        public int NumberOfSeats { get; set; }
    }
}
