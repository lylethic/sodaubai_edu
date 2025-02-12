using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class PhanCongGiaoVienChuNhiemsController : ControllerBase
  {
    private readonly IPC_ChuNhiem _pc;

    public PhanCongGiaoVienChuNhiemsController(IPC_ChuNhiem pc)
    {
      this._pc = pc;
    }

    // GET: api/<PCChuNhiemsController>
    [HttpGet]
    public async Task<IActionResult> GetAll_PCChuNhiem([FromQuery] QueryObject? query)
    {
      query ??= new QueryObject();
      var result = await _pc.GetPC_ChuNhiems();

      if (result.StatusCode == 200)
      {
        var data = result.Datas ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / query.PageSize);
        var paginatedData = data.Skip((query.PageNumber - 1) * query.PageSize).Take(query.PageSize);

        return Ok(new
        {
          message = result.Message,
          data = paginatedData,
          pagination = new
          {
            query.PageNumber,
            query.PageSize,
            totalPages,
            totalResults
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

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }

    // GET api/<PCChuNhiemsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdPC_ChuNhiem(int id)
    {
      var result = await _pc.GetPC_ChuNhiem(id);

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

    [HttpGet, Route("phan-cong-detail")]
    public async Task<IActionResult> GetThongtinlopphancong([FromQuery] QueryObject? queryObject, [FromQuery] int schoolId, [FromQuery] int? gradeId = null, [FromQuery] int? classId = null)
    {
      queryObject ??= new QueryObject();
      if (gradeId.HasValue || classId.HasValue)
      {
        var result = await _pc.Get_ChuNhiem_Teacher_Class(schoolId, gradeId, classId);
        if (result.StatusCode == 200)
        {
          var data = result.Datas ?? [];
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

        if (result.StatusCode == 400)
        {
          return BadRequest(new
          {
            statusCode = result.StatusCode,
            message = result.Message,
            data = result.Datas
          });
        }
        if (result.StatusCode == 404)
        {
          return NotFound(new
          {
            statusCode = result.StatusCode,
            message = result.Message,
            data = result.Datas
          });
        }

        return StatusCode(500, new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }
      else if (!classId.HasValue)
      {
        var result = await _pc.Get_ChuNhiem_Teacher_Class(schoolId, gradeId, null);

        if (result.StatusCode == 200)
        {
          var data = result.Datas ?? [];
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
        if (result.StatusCode == 400)
        {
          return BadRequest(new
          {
            statusCode = result.StatusCode,
            message = result.Message,
            data = result.Datas
          });
        }
        if (result.StatusCode == 404)
        {
          return NotFound(new
          {
            statusCode = result.StatusCode,
            message = result.Message,
            data = result.Datas
          });
        }

        return StatusCode(500, new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }
      else
      {
        var result = await _pc.Get_ChuNhiem_Teacher_Class(schoolId, null, null);
        if (result.StatusCode == 200)
        {

          var data = result.Datas ?? [];
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
        if (result.StatusCode == 400)
        {
          return BadRequest(new
          {
            statusCode = result.StatusCode,
            message = result.Message,
            data = result.Datas
          });
        }
        if (result.StatusCode == 404)
        {
          return NotFound(new
          {
            statusCode = result.StatusCode,
            message = result.Message,
            data = result.Datas
          });
        }

        return StatusCode(500, new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }
    }

    // POST api/<PCChuNhiemsController>
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> CreatePC_ChuNhiem(PC_ChuNhiemDto model)
    {
      var result = await _pc.CreatePC_ChuNhiem(model);

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
          data = result.PC_ChuNhiemDto
        });
      }

      if (result.StatusCode == 409)
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

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _pc.ImportExcelFile(file);

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
        return Ok(new
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

    // PUT api/<PCChuNhiemsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePC_ChuNhiem(int id, PC_ChuNhiemDto model)
    {
      var result = await _pc.UpdatePC_ChuNhiem(id, model);

      if (result.StatusCode == 404)
      {
        return NotFound(result);
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

      return StatusCode(500, result);
    }

    // DELETE api/<PCChuNhiemsController>/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePC_ChuNhiem(int id)
    {
      var result = await _pc.DeletePC_ChuNhiem(id);

      if (result.StatusCode == 404)
      {
        return NotFound(result);
      }

      if (result.StatusCode == 200)
      {
        return Ok(result);
      }

      return StatusCode(500, result);
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _pc.BulkDelete(ids);

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
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message
        });
      }

      if (result.StatusCode == 400)
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
