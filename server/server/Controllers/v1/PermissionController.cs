using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications;
using AutoMapper;
using Asp.Versioning;
using server.Applications.ResponseModel;

namespace server.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiController]
public class PermissionController : BaseApiController
{
  private readonly IPermission _repository;

  public PermissionController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IPermission repository) : base(mapper, httpContextAccessor, logger)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task<IActionResult> Get([FromQuery] QueryObject request)
  {
    var result = await _repository.GetPermissions(request);
    var data = new PaginatedResponse<PermissionDto>
    {
      Items = _mapper.Map<IEnumerable<PermissionDto>>(result.Items),
      TotalCount = result.TotalCount,
      PageNumber = result.PageNumber,
      PageSize = result.PageSize
    };
    return Success(data);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> Get(int id)
  {
    var result = await _repository.GetPermission(id);
    return Success(_mapper.Map<PermissionDto>(result));
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] PermissionDto entity)
  {
    var map = _mapper.Map<Permission>(entity);
    var result = await _repository.AddPermission(map);
    return Success(result);
  }

  [HttpPut("id")]
  public async Task<IActionResult> Put(int id, [FromBody] PermissionDto entity)
  {
    entity.Id = id;
    var map = _mapper.Map<Permission>(entity);
    var result = await _repository.UpdatePermission(map);
    return Success(result);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var result = await _repository.DeletePermission(id);
    return Success(result);
  }
}
