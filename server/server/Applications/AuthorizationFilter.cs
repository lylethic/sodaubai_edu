using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using server.Interfaces;

namespace server.Applications;

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

      var key = Encoding.UTF8.GetBytes(secretKey);

      var validationParameters = new TokenValidationParameters
      {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = _configuration["JwtSettings:Issuer"],
        ValidAudience = _configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero // To prevent token expiration buffer
      };

      var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

      // Store the principal in HttpContext for later use
      context.HttpContext.User = principal;
    }
    catch (SecurityTokenExpiredException)
    {
      context.Result = new UnauthorizedObjectResult(new
      {
        httpStatus = 401,
        message = "Token has expired."
      });
      _logger.Error("Token has expired.");
    }
    catch (SecurityTokenException ex)
    {
      context.Result = new UnauthorizedObjectResult(new
      {
        httpStatus = 401,
        message = $"AuthorizationFilter - Invalid token: {ex.Message}"
      });
      _logger.Error($"AuthorizationFilter - Invalid token: {ex.Message}");
    }
    catch (Exception ex)
    {
      context.Result = new UnauthorizedObjectResult(new
      {
        httpStatus = 401,
        message = $"AuthorizationFilter - Token validation failed: {ex.Message}"
      });
      _logger.Error($"AuthorizationFilter - Token validation failed: {ex.Message}");
    }
  }
}

