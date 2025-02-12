using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class WeeksController : ControllerBase
  {
    private readonly IWeek _week;

    public WeeksController(IWeek week)
    {
      this._week = week;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllWeek([FromQuery] QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _week.GetWeeks();
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

      return StatusCode(500, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // GET api/<WeeksController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _week.GetWeek(id);
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

    [HttpGet("get-week-to-update/{id}")]
    public async Task<IActionResult> GetWeekToUpdate(int id)
    {
      var result = await _week.GetWeekToUpdate(id);
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

    [HttpGet, Route("Get7DaysInWeek")]
    public async Task<IActionResult> Get7DaysInWeek(int selectedWeekId)
    {
      var result = await _week.Get7DaysInWeek(selectedWeekId);
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
        message = result.Message
      });
    }

    // POST api/<WeeksController>
    /* Mau
    {
      "weekId": 0,
      "semesterId": 1,
      "weekName": "Tuần 101",
      "weekStart": "2024-10-21",
      "weekEnd": "2024-10-27",
      "status": true
    }
    */
    [HttpPost]
    public async Task<IActionResult> CreateWeek(WeekDto model)
    {
      var result = await _week.CreateWeek(model);

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

    // PUT api/<WeeksController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWeek(int id, WeekDto model)
    {
      var result = await _week.UpdateWeek(id, model);

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

    // DELETE api/<WeeksController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWeek(int id)
    {
      var result = await _week.DeleteWeek(id);

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
    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete([FromBody] List<int> ids)
    {
      var result = await _week.BulkDelete(ids);

      if (result.StatusCode == 404)
      {
        return NotFound(new
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
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _week.ImportExcelFile(file);

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
        status = result.StatusCode,
        message = result.Message
      });
    }
  }
}

