using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;

namespace server.Common.Filter;

public class AuthorizationFilterAttribute : Attribute, IAuthorizationFilter
{
    #region ===[ Private Members ]=============================================================

    private readonly string _secretKey;

    #endregion

    #region ===[ Constructor ]=================================================================

    public AuthorizationFilterAttribute(IConfiguration configuration)
    {
        _secretKey = configuration["JwtSettings:SecretKey"];
    }

    #endregion

    #region ===[ Public Methods ]==============================================================

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var authHeader = context.HttpContext.Request.Headers["Authorization"].ToString();
        var authController = new Controllers.AuthenController();

        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            context.Result = authController.NotAuthorized();
            return;
        }

        var token = authHeader.Substring("Bearer ".Length).Trim();

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secretKey);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            // Token is valid, let the request proceed
        }
        catch (Exception)
        {
            // Token validation failed
            context.Result = authController.NotAuthorized();
        }
    }

    #endregion
}
