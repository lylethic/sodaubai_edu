using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class TeachersController : ControllerBase
  {
    private readonly ITeacher _teacherRepo;
    private readonly IPhotoService _photoService;

    public TeachersController(ITeacher teacherRepo, IPhotoService photoService)
    {
      this._teacherRepo = teacherRepo;
      this._photoService = photoService;
    }

    // GET: api/Teachers
    [HttpGet]
    public async Task<IActionResult> GetTeachers([FromQuery] QueryObject? queryObject)
    {
      var teachers = await _teacherRepo.GetTeachers(queryObject);

      if (teachers.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = teachers.StatusCode,
          message = teachers.Message,
        });
      }

      if (teachers.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = teachers.StatusCode,
          message = teachers.Message,
          data = teachers.TeacherListDetails
        });
      }

      return StatusCode(500, new
      {
        statusCode = teachers.StatusCode,
        message = teachers.Message,
      });
    }

    [HttpGet, Route("get-teachers-by-school")]
    public async Task<IActionResult> GetTeachersBySchool([FromQuery] QueryObject? queryObject, [FromQuery] int schoolId)
    {
      var teachers = await _teacherRepo.GetTeachersBySchool(queryObject, schoolId);

      if (teachers.StatusCode == 400)
      {
        return BadRequest(new
        {
          statusCode = teachers.StatusCode,
          message = teachers.Message,
        });
      }

      if (teachers.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = teachers.StatusCode,
          message = teachers.Message,
        });
      }

      if (teachers.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = teachers.StatusCode,
          message = teachers.Message,
          data = teachers.TeacherListDetails
        });
      }

      return StatusCode(500, new
      {
        statusCode = teachers.StatusCode,
        message = teachers.Message,
      });
    }

    [HttpGet, Route("teachers-by-school")]
    public async Task<IActionResult> GetAllTeachersBySchool([FromQuery] QueryObject? queryObject, [FromQuery] int? schoolId = null)
    {
      queryObject ??= new QueryObject();
      var result = await _teacherRepo.GetTeachersBySchool(schoolId);

      if (result.StatusCode == 200)
      {
        var data = result.TeacherListDetails ?? [];
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
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }

      if (result.StatusCode == 400)
      {
        return BadRequest(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    // GET: api/Teachers/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTeacher(int id)
    {
      var teacher = await _teacherRepo.GetTeacher(id);

      if (teacher.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = teacher.StatusCode,
          message = teacher.Message,
        });
      }

      if (teacher.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = teacher.StatusCode,
          message = teacher.Message,
          data = teacher.TeacherDetail
        });
      }

      return StatusCode(500, new
      {
        statusCode = teacher.StatusCode,
        message = teacher.Message,
      });
    }

    [HttpGet("teacher-to-update/{id}")]
    public async Task<IActionResult> GetTeacherToUpdate(int id)
    {
      var teacher = await _teacherRepo.GetTeacherToUpdate(id);

      if (teacher.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = teacher.StatusCode,
          message = teacher.Message,
        });
      }

      if (teacher.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = teacher.StatusCode,
          message = teacher.Message,
          data = teacher.TeacherToUpdate
        });
      }

      return StatusCode(500, new
      {
        statusCode = teacher.StatusCode,
        message = teacher.Message,
      });
    }

    [HttpGet("teacher-by-account/{id}")]
    public async Task<IActionResult> GetTeacherByAccount(int id)
    {
      var result = await _teacherRepo.GetTeacherIdByAccountId(id);

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.TeacherToUpdate
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    // amount of teacher by schoolId is optional
    [HttpGet("count-amount-of-teachers")]
    public async Task<IActionResult> GetCountAmountOfTeachers(int? id = null)
    {
      var result = await _teacherRepo.GetCountTeachersBySchool(id);
      return Ok(result);
    }

    // PUT: api/Teachers/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeacher(int id, [FromForm] TeacherDto model)
    {
      var teacher = await _teacherRepo.UpdateTeacher(id, model);

      if (teacher.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = teacher.StatusCode,
          message = teacher.Message,
        });
      }

      if (teacher.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = teacher.StatusCode,
          message = teacher.Message,
        });
      }

      return StatusCode(500, new
      {
        statusCode = teacher.StatusCode,
        message = teacher.Message,
      });
    }

    [HttpPost("add-photo")]
    public async Task<IActionResult> CreatePhotoPath(IFormFile file)
    {
      var result = await _photoService.CreatePhotoAsync(file);
      return Ok(result.SecureUrl.ToString());
    }

    // POST: api/Teachers
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> PostTeacher([FromForm] TeacherDto model)
    {
      var result = await _teacherRepo.CreateTeacher(model);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      return StatusCode(result.StatusCode, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    // DELETE: api/Teachers/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeacher(int id)
    {
      var result = await _teacherRepo.DeleteTeacher(id);

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
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
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _teacherRepo.BulkDelete(ids);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost, Route("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _teacherRepo.ImportExcelFile(file);
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

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpGet("search")]
    public async Task<IActionResult> SearchTeacher([FromQuery] QueryObjects? queryObject)
    {

      queryObject ??= new QueryObjects();

      var results = await _teacherRepo.SearchTeacher(queryObject);

      if (results.StatusCode == 200)
      {
        var data = results.TeacherListDetails ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginatedData = data.Skip((queryObject.PageNumber - 1) * queryObject.PageSize).Take(queryObject.PageSize);

        return Ok(new
        {
          statusCode = results.StatusCode,
          message = results.Message,
          data = paginatedData,
          pagination = new
          {
            queryObject.PageNumber,
            queryObject.PageSize,
            totalPages,
            totalResults,
          }
        });
      }
      if (results.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = results.StatusCode,
          message = results.Message,
        });
      }

      return StatusCode(500, new
      {
        statusCode = results.StatusCode,
        message = results.Message,
      });
    }

  }
}
