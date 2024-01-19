using System;
using System.ComponentModel.DataAnnotations;

namespace webapi.Classes
{
    public class Location
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

    }
}
