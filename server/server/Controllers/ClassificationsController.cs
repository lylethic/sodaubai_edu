using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Common.Settings;
using server.Dtos;
using server.Interfaces;

namespace server.Controllers
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class ClassificationsController : BaseApiController
  {
    private readonly IClassification _repo;

    public ClassificationsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IClassification classify) : base(mapper, httpContextAccessor, logger)
    {
      this._repo = classify;
    }

    // GET: api/<ClassificationsController>
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] QueryObject? request)
    {
      try
      {
        var result = await _repo.GetAllAsync(request);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // GET api/<ClassificationsController>/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      try
      {
        var result = await _repo.GetByIDAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // POST api/<ClassificationsController>
    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> Create(ClassificationDto model)
    {
      try
      {
        var result = await _repo.CreateAsync(model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // PUT api/<ClassificationsController>/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ClassificationDto model)
    {
      try
      {
        var result = await _repo.PutAsync(id, model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // DELETE api/<ClassificationsController>/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      try
      {
        var result = await _repo.DeleteAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      try
      {
        var result = await _repo.BulkDeleteAsync(ids);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadExcelFile(IFormFile file)
    {
      var result = await _repo.ImportExcel(file);

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
