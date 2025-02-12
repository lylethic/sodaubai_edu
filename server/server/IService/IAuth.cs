using server.Dtos;
using server.Types.Auth;

namespace server.IService
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
