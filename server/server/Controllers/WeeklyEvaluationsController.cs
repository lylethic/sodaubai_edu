using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class WeeklyEvaluationsController : ControllerBase
  {
    private readonly IWeeklyEvaluation _weeklyEvaluation;

    public WeeklyEvaluationsController(IWeeklyEvaluation weeklyEvaluation)
    {
      _weeklyEvaluation = weeklyEvaluation;
    }

    // GET: api/<WeeklyEvaluationsController>
    [HttpGet]
    public async Task<IActionResult> GetAll(int weekId)
    {
      var result = await _weeklyEvaluation.GetAllByWeek(weekId);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.ListData
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // GET: api/<WeeklyEvaluationsController>
    [HttpGet("get-score-by-week")]
    public async Task<IActionResult> GetAllScoreByWeek(int schoolId, int weekId, int gradeId)
    {
      var result = await _weeklyEvaluation.GetAllScoreByWeek(schoolId, weekId, gradeId);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = result.StatusCode,
          message = result.Message,
          data = result.ListData
        });
      }

      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.Message
      });
    }

    // GET api/<WeeklyEvaluationsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
      var result = await _weeklyEvaluation.GetById(id);
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

    // POST api/<WeeklyEvaluationsController>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] WeeklyEvaluationDto model)
    {
      var result = await _weeklyEvaluation.Create(model);
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

    // PUT api/<WeeklyEvaluationsController>/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] WeeklyEvaluationDto model)
    {
      var result = await _weeklyEvaluation.Update(id, model);
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

    // DELETE api/<WeeklyEvaluationsController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _weeklyEvaluation.Delete(id);
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
        message = result.Message
      });
    }

    [HttpDelete("bulk-delete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _weeklyEvaluation.BulkDelete(ids);
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
        message = result.Message
      });
    }

    [HttpGet("get-score/{id}")]
    public async Task<IActionResult> GetScore(int id)
    {
      var result = await _weeklyEvaluation.GetTotalScoreByWeekId(id);
      return Ok(result);
    }
  }
}
