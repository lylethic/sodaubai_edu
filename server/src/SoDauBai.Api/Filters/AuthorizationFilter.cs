using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using SoDauBai.Application.Interfaces.Services;

namespace SoDauBai.Api.Filters;

public class AuthorizationFilter : IAuthorizationFilter
{
    private readonly IConfiguration _configuration;
    private readonly ILogManager _logger;

    public AuthorizationFilter(IConfiguration configuration, ILogManager logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // Check if the action has [AllowAnonymous] attribute
        var allowAnonymous = context.ActionDescriptor.EndpointMetadata
            .Any(em => em.GetType() == typeof(AllowAnonymousAttribute));

        if (allowAnonymous)
        {
            return; // Skip authorization for [AllowAnonymous] actions
        }

        var authHeader = context.HttpContext.Request.Headers["Authorization"].ToString();

        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                httpStatus = 401,
                message = "Authorization header is missing or invalid"
            });
            return;
        }

        var token = authHeader.Substring("Bearer ".Length).Trim();

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var secretKey = _configuration["JwtSettings:SecretKey"];

            if (string.IsNullOrEmpty(secretKey))
            {
                context.Result = new UnauthorizedObjectResult(new
                {
                    httpStatus = 401,
                    message = "JWT secret key not configured"
                });
                return;
            }

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            context.HttpContext.User = principal;
        }
        catch (SecurityTokenExpiredException)
        {
            context.Result = new UnauthorizedObjectResult(new
            {
                httpStatus = 401,
                message = "Token has expired"
            });
        }
        catch (Exception ex)
        {
            _logger.Error($"Token validation failed: {ex.Message}");
            context.Result = new UnauthorizedObjectResult(new
            {
                httpStatus = 401,
                message = "Invalid token"
            });
        }
    }
}
