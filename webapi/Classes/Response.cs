using Microsoft.AspNetCore.Identity;

namespace webapi.Classes;

public class Response<T>
{
    public int Status { get; set; }
    public T? Result { get; set; }
    public List<ErrorResponse> Errors { get; set; } = new();
}

public class ErrorResponse
{
    public string? Code { get; set; }
    public string? Field { get; set; }
    public string? Description { get; set; }
    
    public ErrorResponse Parse(IdentityError identityError)
    {
        Code = identityError.Code;
        Description = identityError.Description;
        return this;
    }
}