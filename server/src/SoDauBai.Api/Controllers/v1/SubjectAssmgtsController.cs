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
  public class SubjectAssmgtsController : BaseApiController
  {
    private readonly ISubject_Assgm _repo;

    public SubjectAssmgtsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, ISubject_Assgm repo)
      : base(mapper, httpContextAccessor, logger)
    {
      _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll_SubjectAssignment([FromQuery] SubjectAssignmentSearch request)
    {
      try
      {
        var result = await _repo.GetSubjectAssgms(request);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById_SubjectAssignment(int id)
    {
      try
      {
        var result = await _repo.GetByIDAsync(id);
        if (result == null)
          return Error("Phân công môn học không tồn tại");

        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("teacher-by-subject-assign/{id}")]
    public async Task<IActionResult> GetTeacherBySubjcetAssign(int id)
    {
      try
      {
        var result = await _repo.GetTeacherBySubjectAssgm(id);
        if (result == null)
          return Error("Không tìm thấy dữ liệu");

        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("get-to-update/{id}")]
    public async Task<IActionResult> GetByIdSubjectAssignmentToUpdate(int id)
    {
      try
      {
        var result = await _repo.GetByIDAsync(id);
        if (result == null)
          return Error("Không tìm thấy dữ liệu");

        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> CreateSubjectAssignment(SubjectAssgmDto model)
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
    public async Task<IActionResult> UpdateSubjectAssignment(int id, SubjectAssgmDto model)
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
    public async Task<IActionResult> DeleteSubjectAssignment(int id)
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

    [HttpDelete("bulkdelete")]
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
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _repo.ImportExcel(file);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }
  }
}

