using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SoDauBai.Api.Controllers;
using SoDauBai.Api.Filters;
using SoDauBai.Api.Filters;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;

namespace SoDauBai.Api.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class MonthlyEvaluationsController : BaseApiController
  {
    private readonly IMonthlyEvaluation _monthlyEva;

    public MonthlyEvaluationsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IMonthlyEvaluation monthlyEva)
      : base(mapper, httpContextAccessor, logger)
    {
      _monthlyEva = monthlyEva;
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

