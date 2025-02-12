using Microsoft.EntityFrameworkCore;
using server.Dtos;
using server.IService;
using server.Models;
using server.Types;
using server.Types.Auth;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace server.Repositories
{
  public class AuthRepositories : IAuth
  {
    private readonly Data.SoDauBaiContext _context;
    private readonly IConfiguration _config;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ITokenService _tokenService;

    public AuthRepositories(Data.SoDauBaiContext context, IConfiguration config, IHttpContextAccessor httpContextAccessor, ITokenService tokenService)
    {
      _context = context;
      _config = config;
      _httpContextAccessor = httpContextAccessor;
      _tokenService = tokenService;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="model"></param>
    /// <returns>
    //    /// export const RegisterRes = z.object({
    //    data: z.object ({
    //		token: z.string (),
    //		expiresAt: z.string (),
    //		account: z.object ({
    //			id: z.number(),
    //			roleIdId: z.number(),
    //			schoolId: z.number(),
    //			email: z.string (),
    //		}),
    //	}),
    //	message: z.string(),
    //});
    //</returns>

    // public async Task<LoginResType> Login(AuthDto model)
    // {
    //   if (model is null)
    //   {
    //     return new LoginResType(false, "Invalid client request");
    //   }

    //   var user = await _context.Accounts.FirstOrDefaultAsync(u => u.Email == model.Email);

    //   if (user is null)
    //   {
    //     return new LoginResType
    //     {
    //       Message = "Lỗi xảy ra khi xác thực dữ liệu...",
    //       Errors = new List<Error>
    //         {
    //             new Error("Email", "Email hoặc mật khẩu không đúng")
    //         },
    //       StatusCode = 422,
    //       IsSuccess = false
    //     };

    //   }

    //   // Validate password
    //   bool isPasswordValid = ValidateHash(model.Password!, user.MatKhau, user.PasswordSalt);
    //   if (!isPasswordValid)
    //   {
    //     return new LoginResType
    //     {
    //       Message = "Lỗi xảy ra khi xác thực dữ liệu...",
    //       Errors = new List<Error>
    //         {
    //             new Error("Password", "Email hoặc mật khẩu không đúng")
    //         },
    //       StatusCode = 422,
    //       IsSuccess = false
    //     };
    //   }

    //   // Lay ten role
    //   var getRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == user.RoleId);
    //   var role = getRole?.RoleId;

    //   // Add additional claims
    //   var claims = new List<Claim>()
    //   {
    //     new Claim("AccountId", user.AccountId.ToString()),
    //     new Claim("Email", model.Email!),
    //     new Claim("RoleId", role.ToString()!),
    //     new Claim("SchoolId", user.SchoolId.ToString()!),
    //   };

    //   // Generate JWT tokens
    //   var accessToken = _tokenService.GenerateAccessToken(claims);
    //   var refreshToken = _tokenService.GenerateRefreshToken();

    //   // Set cookies
    //   _tokenService.SetJWTTokenCookie(accessToken);
    //   _tokenService.SetRefreshTokenCookie(refreshToken);

    //   var session = new Session
    //   {
    //     AccountId = user.AccountId,
    //     Token = refreshToken,
    //     ExpiresAt = DateTime.UtcNow.AddMonths(Convert.ToInt16(_config["JwtSettings:RefreshTokenExpirationMonths"])), // Expires của refreshToken 
    //     CreatedAt = DateTime.UtcNow,
    //   };

    //   await _context.Sessions.AddAsync(session);
    //   await _context.SaveChangesAsync();

    //   // Construct the account data to be returned
    //   var accountData = new AccountData
    //   {
    //     AccountId = user.AccountId,
    //     RoleId = user.RoleId,
    //     SchoolId = user?.SchoolId,
    //     Email = user?.Email
    //   };

    //   return new LoginResType
    //   {
    //     IsSuccess = true,
    //     StatusCode = 200,
    //     Message = "Login successful",
    //     Data = new LoginResData
    //     {
    //       Token = accessToken,
    //       RefreshToken = refreshToken,
    //       ExpiresAt = DateTime.UtcNow.AddMonths(Convert.ToInt16(_config["JwtSettings:RefreshTokenExpirationMonths"])).ToString(),
    //     }
    //   };
    // }

    public async Task<LoginResType> Login(AuthDto model)
    {
      if (model is null)
      {
        return new LoginResType(false, "Invalid client request");
      }

      var user = await _context.Accounts.FirstOrDefaultAsync(u => u.Email == model.Email);

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

      // Validate password
      bool isPasswordValid = ValidateHash(model.Password!, user.MatKhau, user.PasswordSalt);
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

      // Lay ten role
      var getRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == user.RoleId);
      var role = getRole?.RoleId;

      // Add additional claims
      var claims = new List<Claim>()
      {
        new Claim("AccountId", user.AccountId.ToString()),
        new Claim("Email", model.Email!),
        new Claim("RoleId", role.ToString()!),
        new Claim("SchoolId", user.SchoolId.ToString()!),
      };

      // Generate JWT tokens
      var accessToken = _tokenService.GenerateAccessToken(claims);

      // Set cookies
      _tokenService.SetJWTTokenCookie(accessToken);

      var session = new Session
      {
        AccountId = user.AccountId,
        Token = accessToken,
        ExpiresAt = DateTime.UtcNow.AddHours(Convert.ToInt16(_config["JwtSettings:AccessTokenExpirationHours"])),
        CreatedAt = DateTime.UtcNow,
      };

      await _context.Sessions.AddAsync(session);
      await _context.SaveChangesAsync();

      // Construct the account data to be returned
      var accountData = new AccountData
      {
        AccountId = user.AccountId,
        RoleId = user.RoleId,
        SchoolId = user?.SchoolId,
        Email = user?.Email
      };

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

        var user = await _context.Accounts.FirstOrDefaultAsync(u => u.Email == userStored);

        if (user == null)
        {
          return new LogoutResType(404, false, "User not found");
        }

        // Remove refresh token in DB
        var session = await _context.Sessions
            .FirstOrDefaultAsync(s => s.AccountId == user.AccountId);

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
        // Log the exception if necessary
        return new LogoutResType(500, false, "An error occurred while logging out: " + ex.Message);
      }
    }

    public async Task<LoginResType> Register(RegisterDto model)
    {
      // request empty
      if (model == null)
      {
        return new LoginResType
        {
          IsSuccess = false,
          Message = "Invalid registration request",
        };
      }

      // Check if user already exists
      var existingUser = await _context.Accounts
        .FirstOrDefaultAsync(u => u.Email == model.Email);

      if (existingUser != null)
      {
        return new LoginResType
        {
          IsSuccess = false,
          Message = "Email already registered",
        };
      }

      // Hash the password
      byte[] passwordHash, passwordSalt;
      GenerateHash(model.Password, out passwordHash, out passwordSalt);

      var user = new Account
      {
        RoleId = model.RoleId,
        SchoolId = model.SchoolId,
        Email = model.Email,
        MatKhau = passwordHash,
        PasswordSalt = passwordSalt
      };

      // Save user to the database
      _context.Accounts.Add(user);
      await _context.SaveChangesAsync();


      // Optionally, log the user in after registering (generate tokens)
      var getRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == user.RoleId);
      var role = getRole?.NameRole;
      var claims = new List<Claim>
      {
        new Claim("AccountId", user.AccountId.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, role!),
        new Claim("SchoolId", user.SchoolId.ToString()!),
      };

      var accessToken = _tokenService.GenerateAccessToken(claims);
      _tokenService.SetJWTTokenCookie(accessToken);

      // Save token into table TokenStored
      var tokenResult = new Session
      {
        AccountId = user.AccountId,
        Token = accessToken,
        ExpiresAt = DateTime.UtcNow.AddHours(Convert.ToInt16(_config["JwtSettings:AccessTokenExpirationHours"])),
        CreatedAt = DateTime.UtcNow,
      };

      await _context.Sessions.AddAsync(tokenResult);
      await _context.SaveChangesAsync();

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

    public void GenerateHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
      using (var hash = new HMACSHA512())
      {
        passwordHash = hash.ComputeHash(Encoding.UTF8.GetBytes(password));
        passwordSalt = hash.Key;
      }
    }

    public bool ValidateHash(string password, byte[] passwordhash, byte[] passwordsalt)
    {
      using (var hash = new HMACSHA512(passwordsalt))
      {
        var newPassHash = hash.ComputeHash(Encoding.UTF8.GetBytes(password));
        for (int i = 0; i < newPassHash.Length; i++)
        {
          if (newPassHash[i] != passwordhash[i])
            return false;
        }
        return true;
      }
    }
  }
}
