using SoDauBai.Application.DTOs;
using SoDauBai.Application.DTOs.Types.Auth;

namespace SoDauBai.Application.Interfaces.Services;

public interface IAuths
{
  Task<LoginResType> Login(AuthDto model);
  Task<LogoutResType> Logout();
  Task<LoginResType> Register(RegisterDto model);

}

