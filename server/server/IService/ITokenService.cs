using server.Dtos;
using server.Types.Auth;
using System.Security.Claims;

namespace server.IService
{
  public interface ITokenService
  {
    string GenerateAccessToken(IEnumerable<Claim> claims);

    string GenerateRefreshToken();

    (ClaimsPrincipal Principal, bool IsExpired) GetPrincipalFromExpiredToken(string token);

    Task<LoginResType> RefreshToken(TokenDto model);

    void SetJWTTokenCookie(string token);

    void SetRefreshTokenCookie(string refreshToken);

    void ClearJWTTokenCookie();

    void ClearRefreshTokenCookie();
  }
}
