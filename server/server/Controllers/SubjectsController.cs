using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.Search;
using server.Common.Settings;
using server.Dtos;
using server.Interfaces;

namespace server.Controllers
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class SubjectsController : BaseApiController
  {
    private readonly ISubject _repo;

    public SubjectsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, ISubject repo) : base(mapper, httpContextAccessor, logger)
    {
      this._repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSubject([FromQuery] SubjectSearch request)
    {
      try
      {
        var result = await _repo.GetSubjects(request);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      try
      {
        var result = await _repo.GetByIDAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> CreateSubject(SubjectDto model)
    {
      try
      {
        var result = await _repo.AddAsync(model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("UPDATE")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSubject(int id, SubjectDto model)
    {
      try
      {
        var result = await _repo.UpdateAsync(id, model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("DELETE")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      try
      {
        var result = await _repo.DeleteAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      try
      {
        var result = await _repo.BulkDelete(ids);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _repo.ImportExcelFile(file);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      if (result.StatusCode == 400)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }
  }
}
