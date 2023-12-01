namespace webapi.Classes;

public static class ApplicationRoles
{
    public const string Admin = "Admin";
    public const string User = "User";
  
    public static string[] GetAllRoles()
    {
        return new [] { Admin, User };
    }
}