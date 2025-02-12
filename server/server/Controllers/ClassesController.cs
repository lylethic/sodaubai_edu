using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class ClassesController : ControllerBase
  {
    private readonly IClass _func;

    public ClassesController(IClass func)
    {
      this._func = func;
    }

    // GET: api/<ClassesController>
    [HttpGet]
    public async Task<IActionResult> GetAllClasses([FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _func.GetClasses();
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginatedData = data.Skip((queryObject.PageNumber - 1) * queryObject.PageSize).Take(queryObject.PageSize).ToList();

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
            totalPages,
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

    [HttpGet("class-list")]
    public async Task<IActionResult> GetClasses([FromQuery] QueryObject? queryObject)
    {
      var result = await _func.ClassList(queryObject);
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
      return StatusCode(500, result);
    }

    [HttpGet, Route("get-class-by-school")]
    public async Task<IActionResult> GetClassesBySchool([FromQuery] int schoolId, [FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _func.GetClassesBySchool(schoolId);
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginatedData = data.Skip((queryObject.PageNumber - 1) * queryObject.PageSize).Take(queryObject.PageSize).ToList();

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
            totalPages,
          }
        });
      }

      if (result.StatusCode == 204)
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

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    [HttpGet("get-class-by-school-no-limit")]
    public async Task<IActionResult> GetClassesBySchool([FromQuery] int schoolId)
    {
      var result = await _func.GetClassesBySchool(schoolId);
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data,
          pagination = new
          {
            totalResults,
          }
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }


    // GET api/<ClassesController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _func.GetClass(id);

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
      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    [HttpGet("lop-chu-nhiem/{id}")]
    public async Task<IActionResult> GetLopChuNhiemByTeacherId(int id)
    {
      var result = await _func.GetLopChuNhiemByTeacherID(id);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // GET api/<ClassesController>/5
    [HttpGet("get-detail/{id}")]
    public async Task<IActionResult> GetDetail(int id)
    {
      var result = await _func.GetClassDetail(id);

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
      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }


    // POST api/<ClassesController>
    [HttpPost]
    [Authorize(Policy = "SuperAdminAndAdmin")]
    public async Task<IActionResult> CreateClass(ClassDto model)
    {
      var result = await _func.CreateClass(model);

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }
      if (result.StatusCode == 409)
      {
        return StatusCode(409, new
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

    [HttpPost("create")]
    public async Task<IActionResult> CreateClasses(List<ClassDto> models)
    {
      if (models == null || models.Count == 0)
      {
        return BadRequest(new
        {
          status = 400,
          message = "The request body must contain a non-empty list of ClassDto objects."
        });
      }

      var result = await _func.CreateClasses(models);

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }

      if (result.StatusCode == 409)
      {
        return Conflict(new
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
          message = "Classes created successfully.",
          data = result.Data
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // PUT api/<ClassesController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClass(int id, ClassDto model)
    {
      var result = await _func.UpdateClass(id, model);

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

    // DELETE api/<ClassesController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClass(int id)
    {
      var result = await _func.DeleteClass(id);

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
      var result = await _func.ImportExcel(file);

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

      return StatusCode(500, new { message = result.Message });

    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _func.BulkDelete(ids);

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
  }
}
