using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Dtos;
using server.Interfaces;

namespace server.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class ChiTietSoDauBaisController : BaseApiController
  {
    readonly IChiTietSoDauBai _repo;

    public ChiTietSoDauBaisController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IChiTietSoDauBai repo)
      : base(mapper, httpContextAccessor, logger)
    {
      this._repo = repo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync([FromQuery] ChiTietSoDauBaiSearch request)
    {
      try
      {
        var result = await _repo.GetChiTietSoDauBais(request);
        var data = new PaginatedResponse<ExtendChiTietSoDauBai>
        {
          Items = result.Items,
          PageNumber = result.PageNumber,
          PageSize = result.PageSize,
          TotalCount = result.TotalCount,
        };
        return Success(data);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdChiTietSoDauBai(int id)
    {
      try
      {
        var result = await _repo.GetChiTietSoDauBai(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPost]
    public async Task<IActionResult> CreateChiTietSoDauBai(ChiTietSoDauBaiDto model)
    {
      try
      {
        var result = await _repo.CreateChiTietSoDauBai(model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateChiTietSoDauBai(int id, ChiTietSoDauBaiDto model)
    {
      try
      {
        var result = await _repo.UpdateChiTietSoDauBai(id, model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteChiTietSoDauBai(int id)
    {
      try
      {
        var result = await _repo.DeleteChiTietSoDauBai(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpDelete("bulkdelete")]
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
      var result = await _repo.ImportExcel(file);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
        });
      }

      if (result.StatusCode == 400)
      {
        return BadRequest(new
        {
          message = result.Message,
        });
      }

      return StatusCode(500, new
      {
        message = result.Message,
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("export")]
    public async Task<IActionResult> ExportChiTietSoDauBaiToExcel(int weekId, int classId)
    {
      var exportFolder = Path.Combine(Directory.GetCurrentDirectory(), "Exports");

      if (!Directory.Exists(exportFolder))
      {
        Directory.CreateDirectory(exportFolder);
      }

      var filePath = Path.Combine(exportFolder, $"ChiTietSoDauBaiTuan${weekId}.xlsx");

      var result = await _repo.ExportChiTietSoDauBaiToExcel(weekId, classId, filePath);

      if (result.StatusCode != 200)
      {
        return BadRequest(result);
      }

      var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
      var fileName = $"ChiTietSoDauBaiTuan${weekId}.xlsx";

      return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
  }
}
