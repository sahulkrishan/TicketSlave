using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class LoginController : ControllerBase
{
    [HttpPost]
    public IActionResult Login([FromBody] LoginModel model)
    {
        // Implement your authentication logic here
        // For simplicity, I'll check for a hardcoded username and password
        string validUsername = "user";
        string validPassword = "password";

        if (model.Username == validUsername && model.Password == validPassword)
        {
            return Ok(new { message = "Login successful" });
        }
        else
        {
            return Unauthorized(new { message = "Invalid credentials" });
        }
    }
}

public class LoginModel
{
    public string Username { get; set; }
    public string Password { get; set; }
}

