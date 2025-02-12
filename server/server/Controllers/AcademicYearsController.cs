using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class AcademicYearsController : ControllerBase
  {

    private readonly IAcademicYear _acaYearRepo;

    public AcademicYearsController(IAcademicYear acaYearRepo)
    {
      this._acaYearRepo = acaYearRepo;
    }

    // GET: api/AcademicYears
    [HttpGet]
    public async Task<IActionResult> GetAcademicYears([FromQuery] QueryObject? query)
    {
      query ??= new QueryObject();
      var result = await _acaYearRepo.GetAcademicYears();

      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / query.PageSize);
        var paginatedData = data.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize);

        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = paginatedData,
          pagination = new
          {
            query.PageNumber,
            query.PageSize,
            totalPages,
            totalResults
          }
        });
      }
      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // GET: api/AcademicYears/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAcademicYear(int id)
    {
      var result = await _acaYearRepo.GetAcademicYear(id);

      if (result.StatusCode != 200)
      {
        return BadRequest(result);
      }

      return Ok(new
      {
        message = result.Message,
        data = result.Data
      });
    }

    // PUT: api/AcademicYears/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAcademicYear(int id, AcademicYearDto model)
    {
      var academicYears = await _acaYearRepo.UpdateAcademicYear(id, model);

      if (academicYears.StatusCode != 200)
      {
        return BadRequest(academicYears);
      }

      return Ok(academicYears);
    }

    // POST: api/AcademicYears
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> PostAcademicYear(AcademicYearDto model)
    {
      var academicYears = await _acaYearRepo.CreateAcademicYear(model);

      if (academicYears.StatusCode != 200)
      {
        return BadRequest(academicYears);
      }

      return Ok(academicYears);
    }

    // DELETE: api/AcademicYears/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAcademicYear(int id)
    {
      var academicYears = await _acaYearRepo.DeleteAcademicYear(id);

      if (academicYears.StatusCode != 200)
      {
        return BadRequest(academicYears);
      }

      return Ok(academicYears);
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var academicYears = await _acaYearRepo.BulkDelete(ids);

      if (academicYears.StatusCode != 200)
      {
        return BadRequest();
      }

      return Ok(academicYears);
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcel(IFormFile file)
    {
      try
      {
        var result = await _acaYearRepo.ImportExcel(file);

        if (result.StatusCode == 200)
        {
          return Ok(result);
        }

        return BadRequest(result);
      }
      catch (Exception ex)
      {
        throw new Exception($"Failed: {ex.Message}");
      }
    }
  }
}
