﻿namespace webapi.Models;

public class TokenRefreshModel
{
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
}