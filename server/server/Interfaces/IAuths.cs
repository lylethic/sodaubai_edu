using server.Dtos;
using server.Types.Auth;

namespace server.Interfaces;

public interface IAuths
{
  Task<LoginResType> Login(AuthDto model);
  Task<LogoutResType> Logout();
  Task<LoginResType> Register(RegisterDto model);

}
