using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using SoDauBai.Infrastructure.Data;
using SoDauBai.Infrastructure.Services;

namespace SoDauBai.Api.Middlewares;

public class JWTHeaderMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _config;
    private readonly ILogger<JWTHeaderMiddleware> _logger;

    public JWTHeaderMiddleware(RequestDelegate next, IConfiguration config, ILogger<JWTHeaderMiddleware> logger)
    {
        _next = next;
        _config = config;
        _logger = logger;
    }

    public async Task Invoke(HttpContext httpContext, SoDauBaiContext context)
    {
        string? jwtToken = null;

        var authHeader = httpContext.Request.Headers["Authorization"].FirstOrDefault();
        if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            jwtToken = authHeader.Substring("Bearer ".Length).Trim();
        }
        else
        {
            var cookieName = "jwtAccessToken";
            jwtToken = httpContext.Request.Cookies[cookieName];
        }

        if (!string.IsNullOrEmpty(jwtToken))
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!);
            System.Security.Claims.ClaimsPrincipal? principal = null;

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _config["JwtSettings:Issuer"],
                    ValidAudience = _config["JwtSettings:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.Zero
                };

                principal = tokenHandler.ValidateToken(jwtToken, validationParameters, out _);
            }
            catch (SecurityTokenExpiredException)
            {
                _logger.LogDebug("JWT token has expired.");
            }
            catch (SecurityTokenInvalidSignatureException)
            {
                _logger.LogError("Invalid JWT Signature.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Token validation failed: {ex.Message}");
            }

            if (principal != null)
            {
                var revokedToken = await context.Sessions
                    .AsNoTracking()
                    .AnyAsync(session => session.Token == TokenRevocation.GetStorageValue(jwtToken) && session.ExpiresAt > DateTime.UtcNow);

                if (revokedToken)
                {
                    httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await httpContext.Response.WriteAsJsonAsync(new { message = "Token has been revoked." });
                    return;
                }

                if (!httpContext.Request.Headers.ContainsKey("Authorization"))
                {
                    httpContext.Request.Headers.Append("Authorization", $"Bearer {jwtToken}");
                }
            }
        }

        await _next(httpContext);
    }
}
