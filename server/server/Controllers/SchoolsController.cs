using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Common.Settings;
using server.Dtos;
using server.Interfaces;

namespace server.Controllers
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  [Authorize]
  public class SchoolsController : BaseApiController
  {
    private readonly ISchool _school;
    public SchoolsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, ISchool school) : base(mapper, httpContextAccessor, logger)
    {
      this._school = school;
      _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetSchools([FromQuery] QueryObject request)
    {
      try
      {
        var result = await _school.GetSchools(request);
        var data = new PaginatedResponse<SchoolDto>
        {
          Items = _mapper.Map<IEnumerable<SchoolDto>>(result.Items),
          TotalCount = result.TotalCount,
          PageNumber = result.PageNumber,
          PageSize = result.PageSize
        };
        return Success(data);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpGet, Route("{id}")]
    public async Task<IActionResult> GetSchoolById(int id)
    {
      var result = await _school.GetSchool(id);
      return Success(_mapper.Map<SchoolDto>(result));
    }

    [HttpGet, Route("get-name-of-school/{id}")]
    public async Task<IActionResult> GetNameOfSchoolById(int id)
    {
      try
      {
        var result = await _school.GetNameOfSchool(id);
        return StatusCode(200, new { nameSchool = result });
      }
      catch (Exception ex)
      {
        return StatusCode(500, ex.Message);
      }
    }

    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> CreateSchool(SchoolDto model)
    {
      var result = await _school.CreateSchool(model);
      return Success(_mapper.Map<SchoolDto>(result));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SchoolDto model)
    {
      var result = await _school.UpdateSchool(id, model);
      return Success(_mapper.Map<SchoolDto>(result));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _school.DeleteSchool(id);
      return Success(result);
    }

    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _school.BulkDelete(ids);
      return Success(result);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _school.ImportExcelFile(file);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = 200,
          message = result.Message
        });
      }

      if (result.StatusCode == 400)
        return StatusCode(500, new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    [HttpPost("export")]
    public async Task<IActionResult> ExportSchools([FromBody] List<int> ids)
    {
      var exportFolder = Path.Combine(Directory.GetCurrentDirectory(), "Exports");

      // Ensure the directory exists
      if (!Directory.Exists(exportFolder))
      {
        Directory.CreateDirectory(exportFolder);
      }

      var filePath = Path.Combine(exportFolder, "Schools.xlsx");

      var result = await _school.ExportSchoolsExcel(ids, filePath);

      if (result.StatusCode != 200)
      {
        return BadRequest(result);
      }

      // Return file for download after successful export
      var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
      var fileName = "Schools.xlsx";

      return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
  }
}
