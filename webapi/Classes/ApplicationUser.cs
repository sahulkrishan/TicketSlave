using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace webapi.Classes
{
    public class ApplicationUser : IdentityUser
    {
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        [Required] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [Required] public bool AcceptedTerms { get; set; } = false;
        public DateTime? DateAcceptedTerms { get; set; } = DateTime.UtcNow;
        public List<RefreshToken> RefreshTokens { get; set; } = new ();

    }
}
