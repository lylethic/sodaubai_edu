using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Models;
using server.Dtos;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using server.Applications;
using AutoMapper;
using server.Applications.ResponseModel;

namespace server.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class UserPermissionController : BaseApiController
{
  private readonly IUserPermission _repository;

  public UserPermissionController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IUserPermission repository) : base(mapper, httpContextAccessor, logger)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task<IActionResult> Get([FromQuery] QueryObject request)
  {
    try
    {
      var result = await _repository.GetUserPermissions(request);
      var data = new PaginatedResponse<UserPermissionDto>
      {
        Items = _mapper.Map<IEnumerable<UserPermissionDto>>(result.Items),
        TotalCount = result.TotalCount,
        PageNumber = result.PageNumber,
        PageSize = result.PageSize
      };
      return Success(data);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> Get(int id)
  {
    try
    {
      var result = await _repository.GetUserPermission(id);
      return Success(_mapper.Map<UserPermissionDto>(result));
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] UserPermissionDto entity)
  {
    try
    {
      var result = await _repository.AddUserPermission(_mapper.Map<UserPermission>(entity));
      return Success(result);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(int id, [FromBody] UserPermissionDto entity)
  {
    try
    {
      var result = await _repository.UpdateUserPermission(_mapper.Map<UserPermission>(entity));
      return Success(result);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    try
    {
      var result = await _repository.DeleteUserPermission(id);
      return Success(result);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }
}
