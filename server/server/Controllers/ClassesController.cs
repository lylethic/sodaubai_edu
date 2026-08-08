using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Dtos;
using server.Interfaces;
using server.IService;

namespace server.Controllers
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class ClassesController : BaseApiController
  {
    private readonly IClass _func;

    public ClassesController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IClass func) : base(mapper, httpContextAccessor, logger)
    {
      this._func = func;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllClasses([FromQuery] QueryObject? queryObject)
    {
      try
      {
        queryObject ??= new QueryObject();
        var paginatedData = await _func.GetClasses(queryObject);

        var meta = new
        {
          queryObject.PageNumber,
          queryObject.PageSize,
          count = paginatedData.Count
        };

        return Success(new { data = paginatedData, meta = meta });
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpGet("class-list")]
    public async Task<IActionResult> GetClasses([FromQuery] QueryObject? queryObject)
    {
      try
      {
        var result = await _func.ClassList(queryObject);
        return Success(new
        {
          data = result.Items,
          pagination = new
          {
            result.PageNumber,
            result.PageSize,
            result.TotalCount,
            totalPages = (int)Math.Ceiling((double)result.TotalCount / result.PageSize)
          }
        });
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpGet, Route("get-class-by-school")]
    public async Task<IActionResult> GetClassesBySchool([FromQuery] int schoolId, [FromQuery] QueryObject? queryObject)
    {
      try
      {
        if (schoolId == 0) return Error("Vui lòng nhập mã trường học");
        var result = await _func.GetClassesBySchool(schoolId, queryObject);
        return Success(new
        {
          data = result.Items,
          pagination = new
          {
            result.PageNumber,
            result.PageSize,
            result.TotalCount,
            totalPages = (int)Math.Ceiling((double)result.TotalCount / result.PageSize)
          }
        });
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpGet("get-class-by-school-no-limit")]
    public async Task<IActionResult> GetClassesBySchoolNoLimit([FromQuery] int schoolId)
    {
      try
      {
        var result = await _func.GetClassesBySchoolNoLimit(schoolId);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      try
      {
        var result = await _func.GetClass(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpGet("lop-chu-nhiem/{id}")]
    public async Task<IActionResult> GetLopChuNhiemByTeacherId(int id)
    {
      try
      {
        var result = await _func.GetLopChuNhiemByTeacherID(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpGet("get-detail/{id}")]
    public async Task<IActionResult> GetDetail(int id)
    {
      try
      {
        var result = await _func.GetClassDetail(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpPost]
    [Authorize(Policy = "SuperAdminAndAdmin")]
    public async Task<IActionResult> CreateClass(ClassDto model)
    {
      try
      {
        var result = await _func.CreateClass(model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateClasses(List<ClassDto> models)
    {
      if (models == null || models.Count == 0)
      {
        return Error("The request body must contain a non-empty list of ClassDto objects.");
      }

      try
      {
        var result = await _func.CreateClasses(models);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateClass(int id, ClassDto model)
    {
      try
      {
        var result = await _func.UpdateClass(id, model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClass(int id)
    {
      try
      {
        await _func.DeleteClass(id);
        return Success("Đã xóa thành công");
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadExcelFile(IFormFile file)
    {
      try
      {
        var result = await _func.ImportExcel(file);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      try
      {
        await _func.BulkDelete(ids);
        return Success("Thành công");
      }
      catch (Exception ex)
      {
        return Error(ex.Message);
      }
    }
  }
}
