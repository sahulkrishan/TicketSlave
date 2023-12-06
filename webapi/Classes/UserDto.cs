namespace webapi.Classes;

public class UserDto
{
  public string FirstName { get; set; }
  public string LastName { get; set; }
  public string? Email { get; set; }
  public string? UserName { get; set; }
  public List<ApplicationRoles> Roles { get; set; } = new();
  public DateTime CreatedAt { get; set; }
  public bool AcceptedTerms { get; set; }
  public DateTime? DateAcceptedTerms { get; set; }
  public bool TwoFactorEnabled { get; set; }

  public static UserDto FromApplicationUser(ApplicationUser user)
  {
    return new UserDto
    {
      FirstName = user.FirstName,
      LastName = user.LastName,
      Email = user.Email,
      UserName = user.UserName,
      CreatedAt = user.CreatedAt,
      AcceptedTerms = user.AcceptedTerms,
      DateAcceptedTerms = user.DateAcceptedTerms,
      TwoFactorEnabled = user.TwoFactorEnabled
    };
  }
}