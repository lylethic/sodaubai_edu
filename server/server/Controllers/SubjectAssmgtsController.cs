using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class SubjectAssmgtsController : ControllerBase
  {
    private readonly ISubject_Assgm _subject_Assgm;

    public SubjectAssmgtsController(ISubject_Assgm subject_Assgm)
    {
      this._subject_Assgm = subject_Assgm;
    }

    // GET: api/<SubjectAssmgtsController>
    [HttpGet]
    public async Task<IActionResult> GetAll_SubjectAssignment([FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();

      var result = await _subject_Assgm.GetSubjectAssgms();

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
      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // GET api/<SubjectAssmgtsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById_SubjectAssignment(int id)
    {
      var result = await _subject_Assgm.GetSubjectAssgm(id);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        message = result.Message
      });
    }

    [HttpGet("teacher-by-subject-assign/{id}")]
    public async Task<IActionResult> GetTeacherBySubjcetAssign(int id)
    {
      var result = await _subject_Assgm.GetTeacherBySubjectAssgm(id);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        message = result.Message
      });
    }

    [HttpGet("get-to-update/{id}")]
    public async Task<IActionResult> GetByIdSubjectAssignmentToUpdate(int id)
    {
      var result = await _subject_Assgm.GetSubjectAssgmToUpdate(id);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        message = result.Message
      });
    }

    // POST api/<SubjectAssmgtsController>
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> CreateSubjectAssignment(SubjectAssgmDto model)
    {
      var result = await _subject_Assgm.CreateSubjectAssgm(model);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          message = result.Message
        });
      }
      return StatusCode(500, new { message = result.Message });
    }

    // PUT api/<SubjectAssmgtsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSubjectAssignment(int id, SubjectAssgmDto model)
    {
      var result = await _subject_Assgm.UpdateSubjectAssgm(id, model);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          message = result.Message
        });
      }
      return StatusCode(500, new { message = result.Message });
    }

    // DELETE api/<SubjectAssmgtsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSubjectAssignment(int id)
    {
      var result = await _subject_Assgm.DeleteSubjectAssgm(id);
      if (result.StatusCode == 200)
      {
        return Ok(new { message = result.Message });
      }
      if (result.StatusCode == 404)
      {
        return NotFound(new { message = result.Message });
      }
      return StatusCode(500, new { message = result.Message });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _subject_Assgm.BulkDelete(ids);

      if (result.StatusCode == 200)
      {
        return Ok(new { message = result.Message });
      }
      if (result.StatusCode == 400)
      {
        return BadRequest(new { message = result.Message });
      }
      if (result.StatusCode == 404)
      {
        return NotFound(new { message = result.Message });
      }
      return StatusCode(500, new { message = result.Message });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _subject_Assgm.ImportExcel(file);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message
        });
      }
      if (result.StatusCode == 400)
      {
        return BadRequest(new
        {
          message = result.Message
        });
      }

      return StatusCode(500, new { message = result.Message });
    }
  }
}
