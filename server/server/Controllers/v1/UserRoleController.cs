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
public class UserRoleController : BaseApiController
{
  private readonly IUserRole _repository;

  public UserRoleController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IUserRole repository) : base(mapper, httpContextAccessor, logger)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task<IActionResult> Get([FromQuery] QueryObject request)
  {
    try
    {
      var result = await _repository.GetUserRoles(request);
      var data = new PaginatedResponse<UserRoleDto>
      {
        Items = _mapper.Map<IEnumerable<UserRoleDto>>(result.Items),
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
      var result = await _repository.GetUserRole(id);
      return Success(_mapper.Map<UserRoleDto>(result));
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] UserRoleDto entity)
  {
    try
    {
      var result = await _repository.AddUserRole(_mapper.Map<UserRole>(entity));
      return Success(result);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(int id, [FromBody] UserRoleDto entity)
  {
    try
    {
      var result = await _repository.UpdateUserRole(_mapper.Map<UserRole>(entity));
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
      var result = await _repository.DeleteUserRole(id);
      return Success(result);
    }
    catch (Exception ex)
    {
      return Error(ex);
    }
  }
}
