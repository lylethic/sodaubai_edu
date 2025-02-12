using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class GradesController : ControllerBase
  {
    private readonly IGrade _grade;

    public GradesController(IGrade grade)
    {
      this._grade = grade;
    }

    // GET: api/<GradesController>
    [HttpGet]
    public async Task<IActionResult> GetAll_Grade([FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _grade.GetGrades();
      if (result is null)
      {
        return NotFound();
      }
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginatedData = data
        .Skip((queryObject.PageNumber - 1) * queryObject.PageSize)
        .Take(queryObject.PageSize)
        .ToList();

        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = paginatedData,
          pagination = new
          {
            queryObject.PageNumber,
            queryObject.PageSize,
            totalResults,
            totalPages
          }
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // GET api/<GradesController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById_Grade(int id)
    {
      var result = await _grade.GetGrade(id);

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
          message = result.Message
        });
      }
      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // POST api/<GradesController>
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> CreateGrade(GradeDto model)
    {
      var result = await _grade.CreateGrade(model);

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
          message = result.Message
        });
      }
      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // PUT api/<GradesController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGrade(int id, GradeDto model)
    {
      var result = await _grade.UpdateGrade(id, model);

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
          message = result.Message
        });
      }
      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // DELETE api/<GradesController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGrade(int id)
    {
      var result = await _grade.DeleteGrade(id);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
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

    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _grade.BulkDelete(ids);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
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

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _grade.ImportExcelFile(file);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }
      if (result.StatusCode == 400)
      {
        return BadRequest(new
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
