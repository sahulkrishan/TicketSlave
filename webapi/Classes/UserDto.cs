namespace webapi.Classes;

public class UserDto
{
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string? Email { get; set; }
  public string[] Roles { get; set; } = Array.Empty<string>();
  public DateTime CreatedAt { get; set; }
  public bool AcceptedTerms { get; set; }
  public DateTime? DateAcceptedTerms { get; set; }
  public bool TwoFactorEnabled { get; set; }

  public static UserDto FromApplicationUser(ApplicationUser user, string[] roles)
  {
    return new UserDto
    {
      FirstName = user.FirstName,
      LastName = user.LastName,
      Email = user.Email,
      CreatedAt = user.CreatedAt,
      AcceptedTerms = user.AcceptedTerms,
      DateAcceptedTerms = user.DateAcceptedTerms,
      TwoFactorEnabled = user.TwoFactorEnabled,
      Roles = roles
    };
  }
}