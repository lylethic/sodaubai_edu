using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Application.Interfaces;
using server.Application.Dtos;
using server.Common.Settings;

namespace server.Controllers.v1
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuth _authRepo;
        private readonly ITokenService _tokenService;

        public AuthController(IAuth authRepo, ITokenService tokenRepo)
        {
            _authRepo = authRepo;
            _tokenService = tokenRepo;
        }

        // POST: api/Auth
        [HttpPost, Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(AuthDto model)
        {
            var result = await _authRepo.Login(model);
            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode, new
                {
                    message = result.Message,
                    errors = result.Errors,
                    statusCode = result.StatusCode,
                });
            }

            return Ok(new
            {
                isSuccess = result.IsSuccess,
                statusCode = result.StatusCode,
                message = result.Message,
                data = new
                {
                    token = result.Data.Token,
                    expiresAt = result.Data.ExpiresAt
                }
            });
        }

        // POST: api/Register
        [HttpPost, Route("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var result = await _authRepo.Register(model);
            if (!result.IsSuccess)
            {
                return StatusCode(422, result);
            }

            return Ok(new
            {
                success = result.IsSuccess,
                message = result.Message,
                data = new
                {
                    token = result.Data.Token,
                    expiresAt = result.Data.ExpiresAt
                }
            });
        }

        [HttpPost, Route("refresh")]
        public async Task<IActionResult> RefreshToken(TokenDto model)
        {
            var result = await _tokenService.RefreshToken(model);
            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode, new
                {
                    message = result.Message,
                    errors = result.Errors,
                    statusCode = result.StatusCode,
                });
            }

            return Ok(new
            {
                isSuccess = result.IsSuccess,
                statusCode = result.StatusCode,
                message = result.Message,
                data = new
                {
                    token = result.Data.Token,
                    expiresAt = result.Data.ExpiresAt
                }
            });
        }

        [HttpPost, Route("logout")]
        public async Task<IActionResult> Logout()
        {
            var result = await _authRepo.Logout();
            if (!result.IsSuccess)
            {
                return StatusCode(422, new
                {
                    message = result.Message,
                });
            }

            return Ok(new
            {
                message = result.Message,
            });
        }
    }
}
