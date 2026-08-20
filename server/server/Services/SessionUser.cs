using Microsoft.AspNetCore.Http;
using server.Interfaces;
using server.Types.Auth;
using System.Security.Claims;

namespace server.Services
{
  public class SessionUser : ISessionUser
  {
    private readonly IHttpContextAccessor _httpContextAccessor;
    private CurrentUser? _currentUser;

    public SessionUser(IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    public CurrentUser CurrentUser => _currentUser ??= GetCurrentUserFromClaims();

    public int? UserId => CurrentUser.Id;
    public string? Email => CurrentUser.Email;
    public int? SchoolId => CurrentUser.SchoolId;
    public int? RoleId => CurrentUser.RoleId;
    public List<string> Roles => CurrentUser.Roles;
    public bool IsAuthenticated => CurrentUser.IsAuthenticated;

    public string? GetClaim(string claimType)
    {
      return _httpContextAccessor.HttpContext?.User?.FindFirst(claimType)?.Value;
    }

    private CurrentUser GetCurrentUserFromClaims()
    {
      var user = _httpContextAccessor.HttpContext?.User;
      if (user == null || user.Identity == null || !user.Identity.IsAuthenticated)
      {
        return new CurrentUser
        {
          IsAuthenticated = false
        };
      }

      var userIdStr = user.FindFirst("UserId")?.Value;
      int? userId = int.TryParse(userIdStr, out int id) ? id : null;

      var schoolIdStr = user.FindFirst("SchoolId")?.Value;
      int? schoolId = int.TryParse(schoolIdStr, out int sId) ? sId : null;

      var roleIdStr = user.FindFirst("RoleId")?.Value;
      int? roleId = int.TryParse(roleIdStr, out int rId) ? rId : null;

      var email = user.FindFirst("Email")?.Value
                  ?? user.FindFirst(ClaimTypes.Email)?.Value;

      var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

      return new CurrentUser
      {
        Id = userId,
        Email = email,
        SchoolId = schoolId,
        RoleId = roleId,
        Roles = roles,
        IsAuthenticated = true
      };
    }
  }
}
