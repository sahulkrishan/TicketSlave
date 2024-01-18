using System.Text.Json.Serialization;
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

    public static readonly ResponseResult UserNotFoundError = new()
    {
        Code = "UserNotFound",
        Description = "User not found"
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

    public static readonly ResponseResult LocationNotFoundError = new()
    {
        Code = "LocationNotFound",
        Description = "Location could not be found with the associated Id"
    };

    public static readonly ResponseResult FailedToAddObjectError = new()
    {
        Code = "FailedToAddObject",
        Description = "An error occured while trying to add the object"
    };

    public static readonly ResponseResult FailedToDeleteObjectError = new()
    {
        Code = "FailedToDeleteObject",
        Description = "An error occured while trying to delete the object"
    };

    public static readonly ResponseResult EventSeatNotFoundError = new()
    {
        Code = "EventSeatNotFound",
        Description = "Event seat could not be found with the provided id"
    };

    public static readonly ResponseResult InvalidPresaleCodeError = new()
    {
        Code = "InvalidPresaleCode",
        Description = "Presale code has not been provided or is invalid"
    };

    public static readonly ResponseResult EventSeatUnavailableError = new()
    {
        Code = "EventSeatUnavailable",
        Description = "Event seat is not currently available"
    };

    public static readonly ResponseResult EventSeatReservedError = new()
    {
        Code = "EventSeatReserved",
        Description = "Event seat is already reserved and is not available"
    };

    public static readonly ResponseResult ReservationSessionExpiredError = new()
    {
        Code = "ReservationSessionExpired",
        Description = "Reservation session has expired"
    };
}