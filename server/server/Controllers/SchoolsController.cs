using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class SchoolsController : ControllerBase
  {
    private readonly ISchool _school;
    public SchoolsController(ISchool school)
    {
      this._school = school;
    }

    [HttpGet]
    public async Task<IActionResult> GetSchools([FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _school.GetSchools();

      if (result.StatusCode == 200)
      {
        var data = result.SchoolDetails ?? [];
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

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    [HttpGet("get-schools-no-pagination")]
    public async Task<IActionResult> GetSchoolsNoPagination()
    {
      var result = await _school.GetSchoolsNoPagnination();

      if (result.StatusCode == 200)
      {
        return StatusCode(200, new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.SchoolData
        });
      }

      return StatusCode(500, result);
    }

    [HttpGet, Route("{id}")]
    public async Task<IActionResult> GetSchoolById(int id)
    {
      var result = await _school.GetSchool(id);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.SchoolDetail
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

    [Authorize(Policy = "SuperAdmin")]
    [HttpPost]
    public async Task<IActionResult> CreateSchool(SchoolDto model)
    {
      var result = await _school.CreateSchool(model);
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

    [Authorize(Policy = "SuperAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, SchoolDetail model)
    {
      var result = await _school.UpdateSchool(id, model);
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

    [Authorize(Policy = "SuperAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _school.DeleteSchool(id);
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

    [Authorize(Policy = "SuperAdmin")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulKDelete(List<int> ids)
    {
      var result = await _school.BulkDelete(ids);

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

    [Authorize(Policy = "SuperAdmin")]
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

    [Authorize(Policy = "SuperAdmin")]
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
