using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.Search;
using server.Common.Settings;
using server.Dtos;
using server.Interfaces;
using server.IService;
using server.Models;

namespace server.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class TeachersController : BaseApiController
  {
    private readonly ITeacher _teacherRepo;
    private readonly IPhotoService _photoService;

    public TeachersController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, ITeacher teacherRepo, IPhotoService photoService) : base(mapper, httpContextAccessor, logger)
    {
      this._teacherRepo = teacherRepo;
      this._photoService = photoService;
    }

    // GET: api/Teachers
    [HttpGet]
    public async Task<IActionResult> GetAllAsync([FromQuery] TeacherSearch request)
    {
      try
      {
        var result = await _teacherRepo.GetAllAsync(request);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // GET: api/Teachers/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetByIdAsync(int id)
    {
      try
      {
        var result = await _teacherRepo.GetByIDAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> CreatePhotoPath(int id, IFormFile file)
    {
      try
      {
        var result = await _teacherRepo.UpdateImageAsync(id, file);
        return Success(_mapper.Map<Teacher, TeacherDto>(result));
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // POST: api/Teachers
    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> PostAsync([FromBody] TeacherCreateBody model)
    {
      try
      {
        var result = await _teacherRepo.AddAsync(model);
        return Success(_mapper.Map<Teacher, ExtendTeacher>(result));
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // DELETE: api/Teachers/5
    [RequirePermission("DELETE")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeacher(int id)
    {
      try
      {
        var result = await _teacherRepo.DeleteAsync(id);
        return CreatedSuccess(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("DELETE")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      try
      {
        var result = await _teacherRepo.BulkDelete(ids);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAsync(int id, [FromBody] TeacherCreateBody entity)
    {
      try
      {
        var result = await _teacherRepo.UpdateAsync(id, entity);
        return Success(_mapper.Map<Teacher, ExtendTeacher>(result));
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPost, Route("upload-excel")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      var result = await _teacherRepo.ImportExcelFile(file);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          status = 200,
          message = result.Message
        });
      }

      if (result.StatusCode == 400)
        return StatusCode(500, new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });
    }
  }
}
