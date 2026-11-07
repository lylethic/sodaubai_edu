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
  public class WeeksController : BaseApiController
  {
    private readonly IWeek _repo;

    public WeeksController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IWeek repo) : base(mapper, httpContextAccessor, logger)
    {
      this._repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllWeek([FromQuery] WeekSearch request)
    {
      try
      {
        var result = await _repo.GetWeeks(request);
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

    [HttpGet("get-week-to-update/{id}")]
    public async Task<IActionResult> GetWeekToUpdate(int id)
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

    [HttpGet("Get7DaysInWeek")]
    public async Task<IActionResult> Get7DaysInWeek([FromQuery] int selectedWeekId)
    {
      try
      {
        var result = await _repo.Get7DaysInWeek(selectedWeekId);
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
        return StatusCode(result.StatusCode, new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> CreateWeek(WeekDto model)
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
    public async Task<IActionResult> UpdateWeek(int id, WeekDto model)
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

