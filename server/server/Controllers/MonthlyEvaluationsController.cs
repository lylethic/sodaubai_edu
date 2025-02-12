using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.IService;

namespace server.Controllers
{
  [Authorize]
  [Route("api/[controller]")]
  [ApiController]
  public class MonthlyEvaluationsController : ControllerBase
  {
    private readonly IMonthlyEvaluation _monthlyEva;
    public MonthlyEvaluationsController(IMonthlyEvaluation monthlyEva)
    {

      this._monthlyEva = monthlyEva;
    }
    // GET: api/<MonthlyEvaluationsController>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var result = await _monthlyEva.GetAll();
      if (result.StatusCode == 200)
      {

        return Ok(new
        {
          status = result.StatusCode,
          message = result.StatusCode,
          data = result.ListData
        });
      }
      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.StatusCode,
      });
    }

    // GET api/<MonthlyEvaluationsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      var result = await _monthlyEva.GetById(id);
      if (result.StatusCode == 200)
      {

        return Ok(new
        {
          status = result.StatusCode,
          message = result.StatusCode,
          data = result.Data
        });
      }
      return StatusCode(result.StatusCode, new
      {
        status = result.StatusCode,
        message = result.StatusCode,
      });
    }

    // POST api/<MonthlyEvaluationsController>
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT api/<MonthlyEvaluationsController>/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE api/<MonthlyEvaluationsController>/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
