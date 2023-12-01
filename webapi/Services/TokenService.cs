using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace webapi.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var key = _configuration.GetValue<string>("JwtConfig:Key") ?? throw new InvalidOperationException("Jwt key missing");
        var issuer = _configuration.GetValue<string>("JwtConfig:Issuer") ?? throw new InvalidOperationException("Issuer is missing");
        var audience = _configuration.GetValue<string>("JwtConfig:Audience") ?? throw new InvalidOperationException("Audience is missing");
        var expiresInMinutes = _configuration.GetValue<int?>("JwtConfig:ExpiresInMinutes") ?? throw new InvalidOperationException("Expiry time is missing");
        
        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var signinCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        var tokenOptions = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: signinCredentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        return tokenString;
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    { 
        var key = _configuration.GetValue<string>("JwtConfig:Key") ?? throw new InvalidOperationException("Jwt key missing");
        var issuer = _configuration.GetValue<string>("JwtConfig:Issuer") ?? throw new InvalidOperationException("Issuer is missing");
        var audience = _configuration.GetValue<string>("JwtConfig:Audience") ?? throw new InvalidOperationException("Audience is missing");
        
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ValidateLifetime = false,
            ValidAudience = audience,
            ValidIssuer = issuer
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase))
            throw new SecurityTokenException("Invalid token");

        return principal;
    }
}