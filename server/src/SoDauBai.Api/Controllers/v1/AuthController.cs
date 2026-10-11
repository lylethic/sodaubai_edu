using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;

namespace SoDauBai.Api.Controllers.v1
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuths _authRepo;
        private readonly ITokenService _tokenService;
        private readonly IUser _userRepo;
        private readonly IMapper _mapper;
        public AuthController(IAuths authRepo, ITokenService tokenRepo, IUser userRepo, IMapper mapper)
        {
            _authRepo = authRepo;
            _tokenService = tokenRepo;
            _userRepo = userRepo;
            _mapper = mapper;
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
                    token = result.Data!.Token,
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
                    token = result.Data!.Token,
                    expiresAt = result.Data.ExpiresAt
                }
            });
        }

        [HttpPost, Route("refresh")]
        [AllowAnonymous]
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

            if (result.Data == null)
            {
                return StatusCode(500, new
                {
                    isSuccess = false,
                    statusCode = 500,
                    message = "An unexpected error occurred while generating the refresh token data."
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

        [HttpPost, Route("logout"), Authorize]
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

        [HttpGet("/api/v1/auth/me")]
        [Authorize]
        public async Task<IActionResult> MyInfo(string username)
        {
            try
            {
                var result = await _userRepo.GetUserByUsername(username);
                return Ok(new
                {
                    isSuccess = true,
                    statusCode = 200,
                    message = "Successfull",
                    data = _mapper.Map<MyInfoDto>(result)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    isSuccess = false,
                    statusCode = 500,
                    message = ex.Message
                });
            }
        }
    }
}