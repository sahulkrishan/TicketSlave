
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TicketSlave.Classes
{
    public class User : IdentityUser
    {
        [Required] 
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }

    }
}
