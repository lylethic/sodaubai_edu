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
  public class PhanCongGiangDaysController : BaseApiController
  {
    private readonly IPhanCongGiangDaySoDauBai _repo;

    public PhanCongGiangDaysController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IPhanCongGiangDaySoDauBai repo)
      : base(mapper, httpContextAccessor, logger)
    {
      _repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] PhanCongGiangDaySearch request)
    {
      try
      {
        var result = await _repo.GetPC_GiangDay_BiaSDBs(request);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("get-info-by-bia")]
    public async Task<IActionResult> GetByBia([FromQuery] int id)
    {
      try
      {
        var result = await _repo.GetPhanCongGiangDayByBia(id);
        if (result == null)
          return Error("Không tìm thấy phân công");

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
          return Error("Không tìm thấy phân công");

        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> Create(PC_GiangDay_BiaSDBDto model)
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
    public async Task<IActionResult> Update(int id, PC_GiangDay_BiaSDBDto model)
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
    public async Task<IActionResult> UploadExcel(IFormFile file)
    {
      var result = await _repo.ImportExcelFile(file);

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

