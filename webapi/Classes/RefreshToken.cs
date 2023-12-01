using System.ComponentModel.DataAnnotations;

namespace webapi.Classes;

public class RefreshToken
{
  [Key]
  public int Id { get; set; }
  public string Token { get; set; }
  public DateTime ExpiresOn { get; set; }
}