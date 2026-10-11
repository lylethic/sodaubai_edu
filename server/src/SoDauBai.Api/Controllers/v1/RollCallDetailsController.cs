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
  public class RollCallDetailsController : BaseApiController
  {
    private readonly IRollCallDetail _rollCallDetail;

    public RollCallDetailsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IRollCallDetail rollCallDetail)
      : base(mapper, httpContextAccessor, logger)
    {
      _rollCallDetail = rollCallDetail;
    }

    // GET: api/<AbsencesController>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
      var result = await _rollCallDetail.GetAllAsync();
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

    [HttpGet("get-detail-by-rollCallId")]
    public async Task<IActionResult> GetAll(int rollCallId)
    {
      var result = await _rollCallDetail.GetAllAsync(rollCallId);
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

    // GET api/<AbsencesController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
      var result = await _rollCallDetail.GetByIdAsync(id);
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

    // POST api/<AbsencesController>
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] RollCallDetailDto model)
    {
      var result = await _rollCallDetail.CreateAsync(model);
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

    // PUT api/<AbsencesController>/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] RollCallDetailDto model)
    {
      var result = await _rollCallDetail.UpdateAsync(id, model);
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

    // DELETE api/<AbsencesController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      var result = await _rollCallDetail.DeleteAsync(id);
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

    [HttpDelete("bulk-delete/{id}")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _rollCallDetail.BulkDeleteAsync(ids);
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
  }
}

