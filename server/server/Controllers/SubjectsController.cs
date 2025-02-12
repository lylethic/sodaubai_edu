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
  public class SubjectsController : ControllerBase
  {
    private readonly ISubject _subjectRepo;

    public SubjectsController(ISubject subjectRepo)
    {
      this._subjectRepo = subjectRepo;
    }

    // GET: api/<SubjectsController>
    [HttpGet]
    public async Task<IActionResult> GetAllSubject([FromQuery] QueryObject? query)
    {
      query ??= new QueryObject();
      var result = await _subjectRepo.GetSubjects();
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
            totalResults,
            totalPages
          }
        });
      }

      if (result.StatusCode == 404)
      {
        return BadRequest(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }

    // GET api/<SubjectsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _subjectRepo.GetSubject(id);

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
      if (result.StatusCode == 400)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }
      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }

    // POST api/<SubjectsController>
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> CreateSubject(SubjectDto model)
    {
      var result = await _subjectRepo.CreateSubject(model);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 409)
      {
        return StatusCode(409, new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }

    // PUT api/<SubjectsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSubject(int id, SubjectDto model)
    {
      var result = await _subjectRepo.UpdateSubject(id, model);

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

      if (result.StatusCode == 400)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }

    // DELETE api/<SubjectsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _subjectRepo.DeleteSubject(id);

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
        status = result.StatusCode,
        message = result.Message,
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _subjectRepo.BulkDelete(ids);

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
        status = result.StatusCode,
        message = result.Message,
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _subjectRepo.ImportExcelFile(file);

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

      if (result.StatusCode == 400)
      {
        return NotFound(new
        {
          status = result.StatusCode,
          message = result.Message,
        });
      }

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message,
      });
    }
  }
}
