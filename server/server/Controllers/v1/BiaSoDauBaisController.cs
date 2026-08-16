using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Common.Settings;
using server.Dtos;
using server.Interfaces;

namespace server.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class BiaSoDauBaisController : BaseApiController
  {
    readonly IBiaSoDauBai _biaSodaubai;

    public BiaSoDauBaisController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IBiaSoDauBai biasodaubai) : base(mapper, httpContextAccessor, logger)
    {
      _biaSodaubai = biasodaubai;
    }

    [HttpGet]
    public async Task<IActionResult> GetBiaSoDauBais([FromQuery] BiaSoDauBaiSearch request)
    {
      try
      {
        var result = await _biaSodaubai.GetBiaSoDauBais(request);
        var data = new PaginatedResponse<ExtendBiaSoDauBai>
        {
          Items = result.Items,
          PageNumber = result.PageNumber,
          PageSize = result.PageSize,
          TotalCount = result.TotalCount,
        };
        return Success(data);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
      try
      {
        var result = await _biaSodaubai.GetBiaSoDauBai(id);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> Create(BiaSoDauBaiDto model)
    {
      try
      {
        var result = await _biaSodaubai.CreateBiaSoDauBai(model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, BiaSoDauBaiDto model)
    {
      try
      {
        var result = await _biaSodaubai.UpdateBiaSoDauBai(id, model);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
      try
      {
        var result = await _biaSodaubai.DeleteBiaSoDauBai(id);
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
        var result = await _biaSodaubai.BulkDelete(ids);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcel(IFormFile file)
    {
      var result = await _biaSodaubai.ImportExcel(file);
      return StatusCode(result.StatusCode, new { message = result.Message });
    }
  }
}
