using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;
using server.Models;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class StudentsController : ControllerBase
  {
    private readonly IStudent _studentRepo;

    public StudentsController(IStudent studentRepo)
    {
      _studentRepo = studentRepo;
    }

    // GET: api/Students
    [HttpGet]
    public async Task<IActionResult> GetStudents([FromQuery] QueryObject? queryObject, [FromQuery] int? schoolId = null)
    {
      queryObject ??= new QueryObject();
      var result = await _studentRepo.GetStudents(schoolId);
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginagedData = data
        .Skip((queryObject.PageNumber - 1) * queryObject.PageSize)
        .Take(queryObject.PageSize)
        .ToList();

        return StatusCode(200, new
        {
          status = result.StatusCode,
          message = result.Message,
          data = paginagedData,
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
          message = result.Message,
          data = result.Data
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    [HttpGet("get-student-by-class")]
    public async Task<IActionResult> GetStudents([FromQuery] QueryObject? queryObject, [FromQuery] int schoolId, int classId)
    {
      queryObject ??= new QueryObject();
      var result = await _studentRepo.GetStudents(schoolId, classId);
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginagedData = data
        .Skip((queryObject.PageNumber - 1) * queryObject.PageSize)
        .Take(queryObject.PageSize)
        .ToList();

        return StatusCode(200, new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data,
          pagination = new
          {
            queryObject.PageNumber,
            queryObject.PageSize,
            totalResults,
            totalPages
          }
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }


    // GET: api/Students/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudent(int id)
    {
      var result = await _studentRepo.GetStudent(id);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data
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

    // POST: api/Students
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<ActionResult<Student>> CreateStudent([FromBody] StudentDto model)
    {
      var result = await _studentRepo.CreateStudent(model);
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
      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // PUT: api/Students/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(int id, StudentDto model)
    {
      var result = await _studentRepo.UpdateStudent(id, model);
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
      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // DELETE: api/Students/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
      var result = await _studentRepo.DeleteStudent(id);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data
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

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _studentRepo.BulkDelete(ids);

      if (result.StatusCode == 400)
      {
        return BadRequest(new
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

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }
      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadExcelFile(IFormFile file)
    {
      var result = await _studentRepo.ImportExcel(file);

      if (result.StatusCode == 200)
      {
        return Ok(new
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
  }
}