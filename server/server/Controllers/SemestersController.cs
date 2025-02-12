using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class SemestersController : ControllerBase
  {
    private readonly ISemester _semester;

    public SemestersController(ISemester semester)
    {
      this._semester = semester;
    }

    // GET: api/AcademicYears1
    [HttpGet]
    public async Task<IActionResult> GetSemesters([FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _semester.GetSemesters();
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginatedData = data.Skip((queryObject.PageNumber - 1) * queryObject.PageSize).Take(queryObject.PageSize);

        return Ok(new
        {
          message = result.Message,
          data = paginatedData,
          pagination = new
          {
            queryObject.PageNumber,
            queryObject.PageSize,
            totalPages,
            totalResults
          }
        });
      }
      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    // GET: api/AcademicYears1/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetSemesterById(int id)
    {
      var result = await _semester.GetSemester(id);

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
      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    // PUT: api/AcademicYears1/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSemester(int id, SemesterDto model)
    {
      var result = await _semester.UpdateSemester(id, model);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
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

    // POST: api/AcademicYears1
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> CreateSemester(SemesterDto model)
    {
      var result = await _semester.CreateSemester(model);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data,
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

    // DELETE: api/AcademicYears1/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _semester.DeleteSemester(id);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
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
      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _semester.BulkDelete(ids);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
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
      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
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
