using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoDauBai.Api.Controllers;
using SoDauBai.Api.Filters;
using SoDauBai.Api.Filters;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;

namespace SoDauBai.Api.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class SemestersController : BaseApiController
  {
    private readonly ISemester _semester;

    public SemestersController(ISemester semester, IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger) : base(mapper, httpContextAccessor, logger)
    {
      this._semester = semester;
    }

    // POST: api/AcademicYears
    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> PostAsync(SemesterDto model)
    {
      try
      {
        var result = await _semester.AddAsync(model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // GET: api/AcademicYears
    [HttpGet]
    public async Task<IActionResult> GetAllAsync([FromQuery] QueryObject request)
    {
      try
      {
        var result = await _semester.GetAllAsync(request);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // GET: api/AcademicYears/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIDAsync(int id)
    {
      try
      {
        var result = await _semester.GetByIDAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // PUT: api/AcademicYears/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAsync(int id, SemesterDto model)
    {
      try
      {
        var result = await _semester.UpdateAsync(id, model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // DELETE: api/AcademicYears/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
      try
      {
        var result = await _semester.DeleteAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDeleteAsync(List<int> ids)
    {
      try
      {
        var result = await _semester.BulkDelete(ids);
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
      var result = await _semester.ImportExcelFile(file);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }
      if (result.StatusCode == 400)
      {
        return BadRequest(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }
      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }
  }
}

