using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.Search;
using server.Dtos;
using server.Interfaces;

namespace server.Controllers
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class PhanCongChuNhiemsController : BaseApiController
  {
    private readonly IPhanCongChuNhiem _repo;

    public PhanCongChuNhiemsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IPhanCongChuNhiem repo) : base(mapper, httpContextAccessor, logger)
    {
      this._repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync([FromQuery] PhanCongChuNhiemSearch query)
    {
      try
      {
        var result = await _repo.GetAllAsync(query);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id)
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

    [HttpPost]
    public async Task<IActionResult> CreateAsync(PhanCongChuNhiemDto model)
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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAsync(int id, PhanCongChuNhiemDto model)
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAsync(int id)
    {
      try
      {
        var result = await _repo.Async(id);
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
        return Ok(new { status = result.StatusCode, message = result.Message });
      }
      if (result.StatusCode == 400)
      {
        return BadRequest(new { status = result.StatusCode, message = result.Message });
      }

      return StatusCode(500, new { status = result.StatusCode, message = result.Message });
    }

  }
}
