using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications;
using Asp.Versioning;
using AutoMapper;
using server.Applications.ResponseModel;
using server.Applications.Search;

namespace server.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UserController : BaseApiController
{
  private readonly IUser _repository;

  public UserController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IUser repository) : base(mapper, httpContextAccessor, logger)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task<IActionResult> GetAllAsync([FromQuery] UserSearch request)
  {
    try
    {
      var result = await _repository.GetUsers(request);
      return Success(result);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> GetAsync(int id)
  {
    try
    {
      var result = await _repository.GetUser(id);
      return Success(_mapper.Map<UserDto>(result));
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpPost]
  public async Task<IActionResult> PostAsync([FromBody] UserCreateBody entity)
  {
    try
    {
      var result = await _repository.AddUser(entity);
      return Success(_mapper.Map<User, UserDto>(result));
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpPost("upload")]
  public async Task<IActionResult> CreatePhotoPath(int id, IFormFile file)
  {
    try
    {
      var result = await _repository.UploadImageAsync(id, file);
      return Success(_mapper.Map<User, UserDto>(result));
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> PutAsync(int id, [FromBody] UserDto entity)
  {
    try
    {
      var result = await _repository.UpdateUser(id, _mapper.Map<User>(entity));
      return Success(_mapper.Map<User, UserDto>(result));
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteAsycn(int id)
  {
    try
    {
      var result = await _repository.DeleteUser(id);
      return Success(result);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }
}
