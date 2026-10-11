using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoDauBai.Api.Controllers;
using SoDauBai.Api.Filters;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Api.Filters;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;

namespace SoDauBai.Api.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class StudentsController : BaseApiController
  {
    private readonly IStudent _repo;

    public StudentsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IStudent repo)
      : base(mapper, httpContextAccessor, logger)
    {
      _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetStudents([FromQuery] StudentSearch request)
    {
      try
      {
        var result = await _repo.GetStudents(request);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("get-student-by-class")]
    public async Task<IActionResult> GetStudentsByClass([FromQuery] int schoolId, [FromQuery] int classId)
    {
      try
      {
        var result = await _repo.GetStudentsByClass(schoolId, classId);
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
        if (result == null)
          return Error("Học sinh không tồn tại");

        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> CreateStudent(StudentDto model)
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
    public async Task<IActionResult> UpdateStudent(int id, StudentDto model)
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
    public async Task<IActionResult> UploadExcelFile(IFormFile file)
    {
      var result = await _repo.ImportExcel(file);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }
  }
}
