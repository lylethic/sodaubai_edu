using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class ClassificationsController : ControllerBase
  {
    private readonly IClassify _classify;

    public ClassificationsController(IClassify classify)
    {
      this._classify = classify;
    }

    // GET: api/<ClassificationsController>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _classify.GetClassifys();
      if (result.StatusCode == 200)
      {
        var data = result.Data ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginatedData = data.Skip((queryObject.PageNumber - 1) * queryObject.PageSize).Take(queryObject.PageSize);
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.Data,
          pagination = new
          {
            queryObject.PageNumber,
            queryObject.PageSize,
            totalPages,
            totalResults
          }
        });
      }

      if (result.StatusCode == 409)
      {
        return StatusCode(409, new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      if (result.StatusCode == 400)
      {
        return BadRequest(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    // GET api/<ClassificationsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _classify.GetClassify(id);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }
      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }
      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    // POST api/<ClassificationsController>
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> Create(ClassifyDto model)
    {
      var result = await _classify.CreateClassify(model);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 409)
      {
        return StatusCode(409, new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    // PUT api/<ClassificationsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ClassifyDto model)
    {
      var result = await _classify.UpdateClassify(id, model);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    // DELETE api/<ClassificationsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _classify.DeleteClassify(id);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _classify.BulkDelete(ids);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.Data
        });
      }

      if (result.StatusCode == 400)
      {
        return BadRequest(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }
      if (result.StatusCode == 404)
      {
        return NotFound(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }
      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadExcelFile(IFormFile file)
    {
      var result = await _classify.ImportExcel(file);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }
      if (result.StatusCode == 400)
      {
        return BadRequest(new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }
  }
}
