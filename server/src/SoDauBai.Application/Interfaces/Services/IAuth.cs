using SoDauBai.Application.DTOs;
using SoDauBai.Application.DTOs.Types.Auth;

namespace SoDauBai.Application.Interfaces.Services
{
  public interface IAuth
  {
    Task<LoginResType> Login(AuthDto model);
    Task<LogoutResType> Logout();
    Task<LoginResType> Register(RegisterDto model);
    void GenerateHash(string password, out byte[] passwordHash, out byte[] passwordSalt);
    Boolean ValidateHash(string password, byte[] passwordhash, byte[] passwordsalt);
  }
}


