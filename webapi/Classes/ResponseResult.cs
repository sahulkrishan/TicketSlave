using Microsoft.AspNetCore.Identity;

namespace webapi.Classes;

public class ResponseResult
{
    public string? Code { get; set; }
    public string? Field { get; set; }
    public string? Description { get; set; }

    public ResponseResult Parse(IdentityError identityError)
    {
        Code = identityError.Code;
        Description = identityError.Description;
        return this;
    }

    public static readonly ResponseResult DeclinedTermsError = new ResponseResult
    {
        Code = "AcceptedTerms",
        Description = "You must accept the terms and conditions"
    };

    public static readonly ResponseResult UserExistsError = new ResponseResult
    {
        Code = "UserExists",
        Description = "User already exists"
    };

    public static readonly ResponseResult EmailNotFoundError = new ResponseResult
    {
        Code = "EmailNotFound",
        Description = "Email does not exist"
    };

    public static readonly ResponseResult IncorrectPasswordError = new ResponseResult
    {
        Code = "IncorrectPassword",
        Description = "Password is invalid"
    };

    public static readonly ResponseResult VerificationRequiredError = new ResponseResult
    {
        Code = "VerificationRequired",
        Description = "Account requires verification"
    };

    public static readonly ResponseResult UserLockedOutError = new ResponseResult
    {
        Code = "UserLockedOut",
        Description = "User is locked out"
    };

    public static readonly ResponseResult UserSignInNotAllowedError = new ResponseResult
    {
        Code = "UserSignInNotAllowed",
        Description = "User is not allowed to sign in"
    };

    public static readonly ResponseResult AwaitingAccountVerification = new ResponseResult
    {
        Code = "AwaitingAccountVerification",
        Description = "Account is awaiting verification"
    };
}