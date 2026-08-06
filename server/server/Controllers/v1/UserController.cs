using Microsoft.AspNetCore.Mvc;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using server.Applications.ResponseModel;

namespace server.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
public class UserController : BaseApiController
{
  private readonly IUser _repository;

  public UserController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IUser repository) : base(mapper, httpContextAccessor, logger)
  {
    _repository = repository;
  }

  [HttpGet]
  public async Task<IActionResult> Get([FromQuery] QueryObject request)
  {
    var result = await _repository.GetUsers(request);
    var data = new PaginatedResponse<UserDto>
    {
      Items = _mapper.Map<IEnumerable<UserDto>>(result.Items),
      TotalCount = result.TotalCount,
      PageNumber = result.PageNumber,
      PageSize = result.PageSize
    };
    return Success(data);
  }

  [HttpGet("{id}")]
  public async Task<IActionResult> Get(int id)
  {
    var result = await _repository.GetUser(id);
    return Success(_mapper.Map<UserDto>(result));
  }

  [HttpPost]
  public async Task<IActionResult> Post([FromBody] UserDto entity)
  {
    var result = await _repository.AddUser(_mapper.Map<User>(entity));
    return Success(result);
  }

  [HttpPut("{id}")]
  public async Task<IActionResult> Put(int id, [FromBody] UserDto entity)
  {
    var result = await _repository.UpdateUser(_mapper.Map<User>(entity));
    return Success(result);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id)
  {
    var result = await _repository.DeleteUser(id);
    return Success(result);
  }
}
