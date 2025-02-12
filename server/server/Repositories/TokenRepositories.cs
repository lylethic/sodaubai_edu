using Microsoft.IdentityModel.Tokens;
using server.Dtos;
using server.IService;
using server.Types.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Repositories
{
  public class TokenRepositories : ITokenService
  {
    private readonly Data.SoDauBaiContext _context;
    private readonly IConfiguration _config;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TokenRepositories(Data.SoDauBaiContext context, IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
      this._context = context ?? throw new ArgumentException(nameof(context));
      this._config = config ?? throw new ArgumentException(nameof(config));
      this._httpContextAccessor = httpContextAccessor ?? throw new ArgumentException(nameof(httpContextAccessor));
    }

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
      var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!));

      var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

      // Create a JWT
      var tokeOptions = new JwtSecurityToken(
        issuer: _config["JwtSettings:Issuer"],
        audience: _config["JwtSettings:Audience"],
        claims: claims,
        signingCredentials: signinCredentials,
        expires: DateTime.UtcNow.AddHours(Convert.ToDouble(_config["JwtSettings:AccessTokenExpirationHours"]))
        );

      var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);

      return tokenString;
    }

    public string GenerateRefreshToken()
    {
      var randomNumber = new byte[32];
      using (var rng = RandomNumberGenerator.Create())
      {
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
      }
    }

    public (ClaimsPrincipal Principal, bool IsExpired) GetPrincipalFromExpiredToken(string token)
    {
      var tokenValidationParameters = new TokenValidationParameters
      {
        ValidateAudience = false,
        ValidateIssuer = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!)),
        ValidateLifetime = false // We are bypassing lifetime validation to extract the claims from the expired token
      };

      var tokenHandler = new JwtSecurityTokenHandler();
      SecurityToken securityToken;

      var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
      var jwtSecurityToken = securityToken as JwtSecurityToken;

      if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
      {
        throw new SecurityTokenException("Invalid token");
      }

      // Extract the expiration claim ("exp")
      var expClaim = jwtSecurityToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Exp)?.Value;
      DateTime? expirationTime = null;
      bool isExpired = false;

      if (expClaim != null && long.TryParse(expClaim, out long expUnix))
      {
        // Convert Unix time (in seconds) to DateTime
        expirationTime = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime;

        // Print the expiration time
        Console.WriteLine($"Token expires at: {expirationTime} UTC");

        // Check if the token has already expired
        if (expirationTime < DateTime.UtcNow)
        {
          Console.WriteLine("Access token has expired.");
          isExpired = true;
        }
        else
        {
          Console.WriteLine("Access token is still valid.");
          isExpired = false;
        }
      }
      else
      {
        Console.WriteLine("Expiration claim (exp) not found.");
        throw new SecurityTokenException("Expiration claim not found.");
      }

      return (principal, isExpired);
    }


    public async Task<LoginResType> RefreshToken(TokenDto model)
    {
      if (model is null)
      {
        return new LoginResType(false, 400, "Invalid client request. AccessToken and refreshToken are required");
      }

      string? accessToken = model.AccessToken;

      try
      {
        // Validate: user, AccessToken tu claim Sap het han chua
        var (principal, isExpired) = GetPrincipalFromExpiredToken(accessToken);

        // Log the expiration check result
        if (isExpired)
        {
          Console.WriteLine("Access token has expired.#################################################");
        }
        else
        {
          Console.WriteLine("Access token is still valid.#################################################");
        }

        if (principal == null)
        {
          return new LoginResType(false, 401, "Invalid or expired access token.");
        }

        var accountId = principal.FindFirst("AccountId")?.Value;
        if (string.IsNullOrEmpty(accountId))
        {
          return new LoginResType(false, 400, "Account ID claim not found.");
        }

        // REtrieve
        var tokenStored = _context.Sessions
                         .Where(id => id.AccountId == Convert.ToInt16(accountId))
                         .OrderByDescending(s => s.ExpiresAt)
                         .FirstOrDefault();


        if (tokenStored is null)
        {
          return new LoginResType(false, 404, "Invalid or expired refresh token.");

        }

        if (tokenStored.ExpiresAt < DateTime.UtcNow)
        {
          // Delete expired refresh token
          _context.Sessions.Remove(tokenStored);
          await _context.SaveChangesAsync();

          return new LoginResType(false, 401, "Refresh token has expired and has been removed.");
        }

        // Generate new access and refresh tokens
        var newAccessToken = GenerateAccessToken(principal.Claims);

        // Update refresh token in the database
        tokenStored.Token = newAccessToken;
        await _context.SaveChangesAsync();

        // Luu vao cookies (Server-side-ren)
        SetJWTTokenCookie(newAccessToken);

        return new LoginResType
        {
          IsSuccess = true,
          StatusCode = 200,
          Message = "Refresh Token successful",
          Data = new LoginResData
          {
            Token = newAccessToken,
            ExpiresAt = DateTime.UtcNow.AddHours(Convert.ToInt16(_config["JwtSettings:AccessTokenExpirationHours"])),
          }
        };
      }
      catch (Exception ex)
      {
        return new LoginResType(false, ex.Message);
      }
    }

    public void SetJWTTokenCookie(string token)
    {
      var cookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict, // Prevent CSRF attacks
        Expires = DateTime.UtcNow.AddHours(Convert.ToDouble(_config["JwtSettings:AccessTokenExpirationHours"])),
      };
      try
      {
        _httpContextAccessor.HttpContext?.Response.Cookies.Append("jwtAccessToken", token, cookieOptions);
      }
      catch (Exception ex)
      {
        throw new Exception($"Failed to set JWT cookie: ${ex.Message}");
      }
    }

    public void SetRefreshTokenCookie(string refreshToken)
    {
      var cookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.UtcNow.AddHours(Convert.ToInt16(_config["JwtSettings:AccessTokenExpirationHours"])),
      };
      try
      {
        _httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
      }
      catch (Exception ex)
      {
        throw new Exception($"Failed to set refresh token cookie: {ex.Message}");
      }
    }

    public void ClearJWTTokenCookie()
    {
      var cookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.UtcNow.AddHours(-1) // Set expiration date to the past
      };
      try
      {
        _httpContextAccessor.HttpContext?.Response.Cookies.Append("jwtAccessToken", "", cookieOptions);
      }
      catch (Exception ex)
      {
        throw new Exception($"Failed to clear JWT cookie: {ex.Message}");
      }
    }

    public void ClearRefreshTokenCookie()
    {
      var cookieOptions = new CookieOptions
      {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = DateTime.UtcNow.AddMonths(-1) // Set expiration date to the past
      };
      try
      {
        _httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", "", cookieOptions);
      }
      catch (Exception ex)
      {
        throw new Exception($"Failed to clear refresh token cookie: {ex.Message}");
      }
    }
  }
}
