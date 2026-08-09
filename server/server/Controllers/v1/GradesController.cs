using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Common.Settings;
using server.Dtos;
using server.Interfaces;
using server.IService;

namespace server.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  [Authorize]
  public class GradesController : BaseApiController
  {
    private readonly IGrade _gradeRepo;

    public GradesController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IGrade gradeRepo) : base(mapper, httpContextAccessor, logger)
    {
      _gradeRepo = gradeRepo;
      _mapper = mapper;
    }

    // GET: api/Grades
    [HttpGet]
    public async Task<IActionResult> GetGrades([FromQuery] GradeSearch request)
    {
      try
      {
        var (result, pageNumber, pageSize, totalCount) = await _gradeRepo.GetAllAsync(request);
        var data = new PaginatedResponse<GradeDetail>
        {
          Items = result,
          PageNumber = pageNumber,
          PageSize = pageSize,
          TotalCount = totalCount,
        };
        return Success(data);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    // GET: api/Grades/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetGrade(int id)
    {
      try
      {
        var result = await _gradeRepo.GetAsync(id);
        return Success(_mapper.Map<GradeDetail>(result));
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    // PUT: api/Grades/5
    [RequirePermission("UPDATE")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutGrade(int id, GradeDto grade)
    {
      try
      {
        var result = await _gradeRepo.UpdateAsync(id, grade);
        return Success(_mapper.Map<GradeDetail>(result));
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    // POST: api/Grades
    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> Create(GradeDto grade)
    {
      try
      {
        var result = await _gradeRepo.AddAsync(grade);
        return Success(_mapper.Map<GradeDto>(result));
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // DELETE: api/Grades/5
    [RequirePermission("DELETE")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGrade(int id)
    {
      try
      {
        var result = await _gradeRepo.DeleteAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [RequirePermission("UPDATE")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      try
      {
        var result = await _gradeRepo.BulkDeleteAsync(ids);
        return Success(result);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [RequirePermission("ADMIN")]
    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      try
      {
        var result = await _gradeRepo.ImportExcel(file);

        if (result.Contains("Thành công", StringComparison.OrdinalIgnoreCase))
        {
          return Ok(result);
        }

        return BadRequest(result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Server Error: {ex.Message}");
      }
    }

    [HttpPost("export")]
    public async Task<IActionResult> ExportGrades([FromBody] List<int> ids)
    {
      var exportFolder = Path.Combine(Directory.GetCurrentDirectory(), "Exports");

      if (!Directory.Exists(exportFolder))
      {
        Directory.CreateDirectory(exportFolder);
      }

      var filePath = Path.Combine(exportFolder, "Grades.xlsx");

      var result = await _gradeRepo.ExportGradesExcel(ids, filePath);

      if (result.StatusCode != 200)
      {
        return BadRequest(result);
      }

      var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
      var fileName = "Grades.xlsx";

      return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
  }
}
