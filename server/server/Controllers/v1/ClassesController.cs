using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Dtos;
using server.Interfaces;

namespace server.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class ClassesController : BaseApiController
  {
    private readonly IClass _repo;

    public ClassesController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IClass func) : base(mapper, httpContextAccessor, logger)
    {
      this._repo = func;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync([FromQuery] ClassSearch queryObject)
    {
      try
      {
        var (result, pageNumber, pageSize, totalCount) = await _repo.GetAllAsync(queryObject);
        var data = new PaginatedResponse<ClassDetails>
        {
          Items = result,
          PageNumber = pageNumber,
          PageSize = pageSize,
          TotalCount = totalCount
        };
        return Success(data);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      try
      {
        var result = await _repo.GetAsync(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [HttpPost]
    public async Task<IActionResult> AddAsync(ClassDto model)
    {
      try
      {
        var result = await _repo.AddAsync(model);
        return Success(result);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [HttpPost("create")]
    public async Task<IActionResult> PostBulkAsync(List<ClassDto> models)
    {
      if (models == null || models.Count == 0)
      {
        return Error("The request body must contain a non-empty list of ClassDto objects.");
      }

      try
      {
        var result = await _repo.AddBulkAsync(models);
        return Success(result);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutAsync(int id, ClassDto model)
    {
      try
      {
        var result = await _repo.UpdateAsync(id, model);
        return Success(result);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteClass(int id)
    {
      try
      {
        await _repo.DeleteAsync(id);
        return Success("Đã xóa thành công");
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadExcelFile(IFormFile file)
    {
      try
      {
        var result = await _repo.ImportExcel(file);
        return Success(result);
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }

    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      try
      {
        await _repo.BulkDeleteAsync(ids);
        return Success("Thành công");
      }
      catch (Exception ex)
      {
        _logger.Error(ex.Message);
        return Error(ex);
      }
    }
  }
}
