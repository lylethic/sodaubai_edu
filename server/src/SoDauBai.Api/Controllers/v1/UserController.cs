using Microsoft.AspNetCore.Mvc;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs;
using SoDauBai.Api.Controllers;
using SoDauBai.Api.Filters;
using Asp.Versioning;
using AutoMapper;
using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;

namespace SoDauBai.Api.Controllers.v1;

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
  [Consumes("multipart/form-data")]
  public async Task<IActionResult> CreatePhotoPath([FromForm] int? id, [FromForm] IFormFile file, [FromQuery] int? userId = null)
  {
    try
    {
      var targetId = (id.HasValue && id.Value > 0) ? id.Value : (userId ?? 0);
      var result = await _repository.UploadImageAsync(targetId, file);
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

