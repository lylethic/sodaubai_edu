using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class RollCallsController : ControllerBase
  {
    private readonly IRollCall _rollCall;

    public RollCallsController(IRollCall rollCall)
    {
      this._rollCall = rollCall;
    }

    // GET: api/<RollCallsController>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryObject? queryObject, int weekId, int classId)
    {
      queryObject ??= new QueryObject();
      var result = await _rollCall.RollCalls(weekId, classId);
      if (result.StatusCode == 200)
      {
        var data = result.ListRollCallRes ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginatedData = data
        .Skip((queryObject.PageNumber - 1) * queryObject.PageSize)
        .Take(queryObject.PageSize)
        .ToList();

        return Ok(new
        {
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
      return StatusCode(result.StatusCode, new
      {
        message = result.Message,
        data = result.ListRollCallRes
      });
    }
    /// <summary>
    /// get-rollCall-by-week-class
    /// </summary>
    /// <param name="queryObject">default 1, 20</param>
    /// <param name="weekId">id</param>
    /// <param name="classId">id?</param>
    /// <returns>
    /// {
    ///   "message": "Thành công",
    ///   "data": [
    ///     {
    ///       "rollCallId": 20,
    ///       "classId": 21,
    ///       "weekId": 1,
    ///       "dayOfTheWeek": "Thứ hai",
    ///       "dateAt": "2025-02-03T07:00:00",
    ///       "dateCreated": "2025-02-04T14:54:35.307",
    ///       "dateUpdated": "2025-02-05T17:11:16.553",
    ///       "numberOfAttendants": 39,
    ///       "class": null,
    ///       "rollCallDetails": [],
    ///       "week": null
    ///     },
    ///     {...},
    ///   ],
    ///   "pagination": {
    ///     "pageNumber": 1,
    ///     "pageSize": 20,
    ///     "totalResults": 6,
    ///     "totalPages": 1
    ///  }
    /// }
    /// </returns>
    // [HttpGet("get-by-week-class")]
    // public async Task<IActionResult> GetAll([FromQuery] QueryObject? queryObject, [FromQuery] int weekId, [FromQuery] int? classId)
    // {
    //   queryObject ??= new QueryObject();
    //   var result = await _rollCall.RollCalls(weekId, classId);
    //   if (result.StatusCode == 200)
    //   {
    //     var data = result.ListRollCallDetailRes ?? [];
    //     var totalResults = data.Count;
    //     var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
    //     var paginatedData = data
    //     .Skip((queryObject.PageNumber - 1) * queryObject.PageSize)
    //     .Take(queryObject.PageSize)
    //     .ToList();

    //     return Ok(new
    //     {
    //       message = result.Message,
    //       data = paginatedData,
    //       pagination = new
    //       {
    //         queryObject.PageNumber,
    //         queryObject.PageSize,
    //         totalResults,
    //         totalPages
    //       }
    //     });
    //   }
    //   return StatusCode(result.StatusCode, new
    //   {
    //     message = result.Message,
    //     data = result.ListRollCallRes
    //   });
    // }

    // GET api/<RollCallsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
      var result = await _rollCall.RollCall(id);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.RollCall
        });
      }
      return StatusCode(result.StatusCode, new
      {
        message = result.Message
      });
    }

    // POST api/<RollCallsController>
    /*
      {
        "rollCall": {
          "callRollId": 0,
          "classId": 21,
          "weekId": 4,
          "dayOfTheWeek": "thứ 2",
          "numberOfAttendants": 39,
          "dateAt": "2025-02-10",
          "dateCreated": "2025-02-04T07:53:34.839Z",
          "dateUpdated": null
        },
        "absences": [
          {
            "callRollId": 0,
            "studentId": 156,
            "isExecute": true,
            "description": "Sốt xuất huyết"
          }
        ]
         "absences": []
         null
      }
     */
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] RollCallRequest request)
    {
      var result = await _rollCall.Create(request.RollCall, request.Absences);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.RollCall
        });
      }

      return StatusCode(result.StatusCode, new
      {
        message = result.Message,
        data = result.RollCall
      });

    }

    // PUT api/<RollCallsController>/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] RollCallDto model)
    {
      var result = await _rollCall.Update(id, model);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.RollCall
        });
      }
      return StatusCode(result.StatusCode, new
      {
        message = result.Message,
        data = result.RollCall
      });
    }

    [HttpPut("edit/{id}")]
    public async Task<IActionResult> UpdateRollCall(int id, [FromBody] RollCallRequest request)
    {
      var result = await _rollCall.Update(id, request.RollCall, request.Absences);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
          data = result.RollCall
        });
      }
      return StatusCode(result.StatusCode, new { message = result.Message });
    }

    // DELETE api/<RollCallsController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _rollCall.Delete(id);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
        });
      }
      return StatusCode(result.StatusCode, new
      {
        message = result.Message,
      });
    }

    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _rollCall.BulkDelete(ids);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          message = result.Message,
        });
      }
      return StatusCode(result.StatusCode, new
      {
        message = result.Message,
      });
    }
  }

  public class RollCallRequest
  {
    public RollCallDto? RollCall { get; set; }
    public List<RollCallDetailDto>? Absences { get; set; }
  }
}

