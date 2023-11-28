﻿using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace webapi.Classes;

public class ResponseResult
{
    public string Code { get; set; }
    public string? Description { get; set; }
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Field { get; set; }

    public ResponseResult Parse(IdentityError identityError)
    {
        Code = identityError.Code;
        Description = identityError.Description;
        return this;
    }

    public static readonly ResponseResult DeclinedTermsError = new()
    {
        Code = "AcceptedTerms",
        Description = "You must accept the terms and conditions"
    };

    public static readonly ResponseResult UserExistsError = new()
    {
        Code = "UserExists",
        Description = "User already exists"
    };

    public static readonly ResponseResult EmailNotFoundError = new()
    {
        Code = "EmailNotFound",
        Description = "Email does not exist"
    };

    public static readonly ResponseResult IncorrectPasswordError = new()
    {
        Code = "IncorrectPassword",
        Description = "Password is invalid"
    };

    public static readonly ResponseResult VerificationRequiredError = new()
    {
        Code = "VerificationRequired",
        Description = "Account requires verification"
    };

    public static readonly ResponseResult UserLockedOutError = new()
    {
        Code = "UserLockedOut",
        Description = "User is locked out"
    };

    public static readonly ResponseResult UserSignInNotAllowedError = new()
    {
        Code = "UserSignInNotAllowed",
        Description = "User is not allowed to sign in"
    };

    public static readonly ResponseResult AwaitingAccountVerification = new()
    {
        Code = "AwaitingAccountVerification",
        Description = "Account is awaiting verification"
    };
    
    public static readonly ResponseResult RefreshTokenRequestInvalidError = new()
    {
        Code = "RefreshTokenRequestInvalid",
        Description = "Request model for token refresh is invalid"
    };
    
    public static readonly ResponseResult RefreshTokenInvalidError = new()
    {
        Code = "RefreshTokenInvalid",
        Description = "Refresh token is invalid"
    };
}