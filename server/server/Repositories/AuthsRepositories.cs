using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.Interfaces;
using server.IService;
using server.Models;
using server.Types.Auth;
using System.Security.Claims;

namespace server.Repositories;

public class AuthsRepositories : IAuths
{
  private readonly SoDauBaiContext _context;
  private readonly IConfiguration _config;
  private readonly ITokenService _tokenService;
  private readonly IHttpContextAccessor _httpContextAccessor;
  private readonly IRole _roleRepo;
  private readonly IUserRole _userRoleRepo;
  private readonly IPermission _permission;

  public AuthsRepositories(SoDauBaiContext context, IHttpContextAccessor httpContextAccessor, IConfiguration config, ITokenService tokenService, IRole roleRepo, IUserRole userRoleRepo, IPermission permission)
  {
    _context = context;
    _config = config;
    _tokenService = tokenService;
    _httpContextAccessor = httpContextAccessor;
    _roleRepo = roleRepo;
    _userRoleRepo = userRoleRepo;
    _permission = permission;
  }

  public async Task<LoginResType> Login(AuthDto model)
  {
    if (model is null)
    {
      return new LoginResType(false, "Invalid client request");
    }

    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

    if (user is null)
    {
      return new LoginResType
      {
        Message = "Lỗi xảy ra khi xác thực dữ liệu...",
        Errors = new List<Error>
                {
                    new Error("Email", "Email hoặc mật khẩu không đúng")
                },
        StatusCode = 422,
        IsSuccess = false
      };
    }

    // Validate password with BCrypt
    bool isPasswordValid = BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash);
    if (!isPasswordValid)
    {
      return new LoginResType
      {
        Message = "Lỗi xảy ra khi xác thực dữ liệu...",
        Errors = new List<Error>
                {
                    new Error("Password", "Email hoặc mật khẩu không đúng")
                },
        StatusCode = 422,
        IsSuccess = false
      };
    }

    var userRolesAndPermissions = await _permission.GetUserRolesAndPermissionsAsync(user.Id);
    var claims = new List<Claim>()
        {
            new Claim("UserId", user.Id.ToString()),
            new Claim("Email", model.Email!)
        };

    foreach (var role in userRolesAndPermissions.Roles)
      claims.Add(new Claim(ClaimTypes.Role, role.NameRole));

    if (user.SchoolId.HasValue)
    {
      claims.Add(new Claim("SchoolId", user.SchoolId.Value.ToString()));
    }

    var accessToken = _tokenService.GenerateAccessToken(claims);
    _tokenService.SetJWTTokenCookie(accessToken);

    return new LoginResType
    {
      IsSuccess = true,
      StatusCode = 200,
      Message = "Đăng nhập thành công",
      Data = new LoginResData
      {
        Token = accessToken,
        ExpiresAt = DateTime.UtcNow.AddHours(Convert.ToInt16(_config["JwtSettings:AccessTokenExpirationHours"])),
      }
    };
  }

  public async Task<LoginResType> Register(RegisterDto model)
  {
    if (model == null)
    {
      return new LoginResType
      {
        IsSuccess = false,
        Message = "Invalid registration request",
      };
    }

    var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);

    if (existingUser != null)
    {
      return new LoginResType
      {
        IsSuccess = false,
        Message = "Email already registered",
      };
    }

    // Hash the password using BCrypt
    string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

    var user = new User
    {
      SchoolId = model.SchoolId,
      Email = model.Email,
      PasswordHash = passwordHash,
      DateCreated = DateTime.UtcNow
    };

    if (model.RoleId != null && model.RoleId != 0)
    {
      user.UserRoles.Add(new UserRole
      {
        RoleId = model.RoleId,
        DateCreated = DateTime.UtcNow
      });
    }

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var role = await _permission.GetUserRolesAsync(user.Id);
    var claims = new List<Claim>
        {
            new Claim("UserId", user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("RoleId", role.First().Id.ToString()),
        };

    if (user.SchoolId.HasValue)
    {
      claims.Add(new Claim("SchoolId", user.SchoolId.Value.ToString()));
    }

    var accessToken = _tokenService.GenerateAccessToken(claims);
    _tokenService.SetJWTTokenCookie(accessToken);

    return new LoginResType
    {
      IsSuccess = true,
      Message = "Registration successful",
      Data = new LoginResData
      {
        Token = accessToken,
        ExpiresAt = DateTime.UtcNow.AddHours(Convert.ToInt16(_config["JwtSettings:AccessTokenExpirationHours"])),
      }
    };
  }

  public async Task<LogoutResType> Logout()
  {
    try
    {
      // Get email in Claims jwt
      var userStored = _httpContextAccessor.HttpContext?.User.FindFirst("Email")?.Value;

      if (string.IsNullOrEmpty(userStored))
      {
        return new LogoutResType(404, false, "User not found in the current session");
      }

      var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userStored);

      if (user == null)
      {
        return new LogoutResType(404, false, "User not found");
      }

      // Remove refresh token in DB
      var session = await _context.Sessions
          .FirstOrDefaultAsync(s => s.Id == user.Id);

      if (session != null)
      {
        _context.Sessions.Remove(session);
        await _context.SaveChangesAsync();
      }

      // Clear cookies
      _tokenService.ClearJWTTokenCookie();
      _tokenService.ClearRefreshTokenCookie();

      return new LogoutResType(200, true, "Logout Thành côngy");
    }
    catch (Exception ex)
    {
      return new LogoutResType(500, false, "An error occurred while logging out: " + ex.Message);
    }
  }
}
