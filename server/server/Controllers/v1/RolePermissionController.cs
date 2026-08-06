using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Models;
using server.Dtos;
using Asp.Versioning;
using server.Applications;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using server.Applications.ResponseModel;

namespace server.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class RolePermissionController : BaseApiController
{
  private readonly IRolePermission _repository;

  public RolePermissionController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IRolePermission repository) : base(mapper)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task<IActionResult> Get([FromQuery] QueryObject request)
  {
    var result = await _repository.GetRolePermissions(request);
    var data = new PaginatedResponse<RolePermissionDto>
    {
      Items = _mapper.Map<IEnumerable<RolePermissionDto>>(result.Items),
      TotalCount = result.TotalCount,
      PageNumber = result.PageNumber,
      PageSize = result.PageSize
    };
    return Success(data);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> Get(int id)
  {
    var result = await _repository.GetRolePermission(id);
    if (result == null) return NotFound();
    return Success(result);
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] RolePermissionDto entity)
  {
    var result = await _repository.AddRolePermission(_mapper.Map<RolePermission>(entity));
    return Success(result);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(int id, [FromBody] RolePermissionDto entity)
  {
    var result = await _repository.UpdateRolePermission(_mapper.Map<RolePermission>(entity));
    return Success(result);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var result = await _repository.DeleteRolePermission(id);
    return Success(result);
  }
}
