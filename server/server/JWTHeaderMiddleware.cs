using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace server
{
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

    //public async Task Invoke(HttpContext httpContext)
    //{
    //  var cookieName = "accessToken";
    //  var jwtToken = httpContext.Request.Cookies[cookieName];

    //  if (!string.IsNullOrEmpty(jwtToken))
    //  {
    //    // Validate the JWT before appending it to the header
    //    var tokenHandler = new JwtSecurityTokenHandler();
    //    var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!);

    //    try
    //    {
    //      // Token validation parameters
    //      var validationParameters = new TokenValidationParameters
    //      {
    //        ValidateIssuer = true,
    //        ValidateAudience = true,
    //        ValidateLifetime = true,
    //        ValidateIssuerSigningKey = true,
    //        ValidIssuer = _config["JwtSettings:Issuer"],
    //        ValidAudience = _config["JwtSettings:Audience"],
    //        IssuerSigningKey = new SymmetricSecurityKey(key),
    //        ClockSkew = TimeSpan.Zero // Optional: To prevent token expiration buffer
    //      };

    //      // Validate the token
    //      var principal = tokenHandler.ValidateToken(jwtToken, validationParameters, out var validatedToken);

    //      // Check if the validated token is a valid JWT
    //      if (validatedToken is JwtSecurityToken jwtSecurityToken &&
    //          jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
    //      {
    //        // If token is valid, append the Authorization header
    //        if (!httpContext.Request.Headers.ContainsKey("Authorization"))
    //        {
    //          httpContext.Request.Headers.Append("Authorization", "Bearer " + jwtToken);
    //        }
    //      }
    //    }
    //    catch (SecurityTokenExpiredException ex)
    //    {
    //      _logger.LogError($"JWT token expired: {ex.Message}");

    //      // Token has expired, return 401 Unauthorized with a specific message
    //      httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
    //      httpContext.Response.Headers.Append("JWT token has expired", ex.Message);
    //      await httpContext.Response.WriteAsync("JWT token has expired.");
    //      return;
    //    }
    //    catch (SecurityTokenException ex)
    //    {
    //      _logger.LogError("Invalid JWT token: {Message}", ex.Message);

    //      // Token is invalid, return 401 Unauthorized
    //      httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
    //      await httpContext.Response.WriteAsync("Invalid JWT token. Please sign in again!");
    //      return;
    //    }
    //  }
    //  await _next(httpContext);
    //}

    public async Task Invoke(HttpContext httpContext)
    {
      var cookieName = "jwtAccessToken";
      var jwtToken = httpContext.Request.Cookies[cookieName];

      if (!string.IsNullOrEmpty(jwtToken))
      {
        // Validate the JWT before appending it to the header
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!);

        try
        {
          // Token validation parameters
          var validationParameters = new TokenValidationParameters
          {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _config["JwtSettings:Issuer"],
            ValidAudience = _config["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero // Optional: To prevent token expiration buffer
          };

          // Validate the token
          var principal = tokenHandler.ValidateToken(jwtToken, validationParameters, out var validatedToken);

          // Check if the validated token is a valid JWT
          if (validatedToken is JwtSecurityToken jwtSecurityToken &&
              jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
          {
            // If token is valid, append the Authorization header
            if (!httpContext.Request.Headers.ContainsKey("Authorization"))
            {
              httpContext.Request.Headers.Append("Authorization", "Bearer " + jwtToken);
            }
          }
        }
        catch (SecurityTokenExpiredException ex)
        {
          _logger.LogError($"JWT token expired: {ex.Message}");

          // Token has expired, return 401 Unauthorized with a specific message
          httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
          httpContext.Response.Headers.Append("JWT token has expired", ex.Message);
          await httpContext.Response.WriteAsync("JWT token has expired.");
          return;
        }
        catch (SecurityTokenException ex)
        {
          _logger.LogError("Invalid JWT token: {Message}", ex.Message);

          // Token is invalid, return 401 Unauthorized
          httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
          await httpContext.Response.WriteAsync("Invalid JWT token. Please sign in again!");
          return;
        }
      }
      await _next(httpContext);
    }
  }
}
