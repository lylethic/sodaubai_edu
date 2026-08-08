using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Dtos;
using server.Interfaces;
using server.IService;

namespace server.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  public class AcademicYearsController : BaseApiController
  {
    private readonly IAcademicYear _acaYearRepo;

    public AcademicYearsController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IAcademicYear acaYearRepo) : base(mapper, httpContextAccessor, logger)
    {
      _acaYearRepo = acaYearRepo;
      _mapper = mapper;
    }

    // GET: api/AcademicYears
    [HttpGet]
    public async Task<IActionResult> GetAcademicYears([FromQuery] QueryObject request)
    {
      try
      {
        var result = await _acaYearRepo.GetAcademicYears(request);
        var data = new PaginatedResponse<AcademicYearDto>
        {
          Items = _mapper.Map<IEnumerable<AcademicYearDto>>(result.Items),
          TotalCount = result.TotalCount,
          PageNumber = result.PageNumber,
          PageSize = result.PageSize
        };
        return Success(data);
      }
      catch (Exception ex)
      {
        if (ex is AutoMapperMappingException aex && aex.InnerException != null)
        {
          return Error(ex.Message + "\nInnerException: " + aex.InnerException.Message);
        }
        return Error(ex.Message);
      }
    }

    // GET: api/AcademicYears/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAcademicYear(int id)
    {
      try
      {
        var result = await _acaYearRepo.GetAcademicYear(id);
        return Success(_mapper.Map<AcademicYearDto>(result));
      }
      catch (System.Exception ex)
      {
        return Error(ex.Message);
      }
    }

    // PUT: api/AcademicYears/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAcademicYear(int id, AcademicYearDto model)
    {
      var result = await _acaYearRepo.UpdateAcademicYear(id, model);
      return Success(_mapper.Map<AcademicYearDto>(result));
    }

    // POST: api/AcademicYears
    [HttpPost]
    public async Task<IActionResult> PostAcademicYear(AcademicYearDto model)
    {
      var result = await _acaYearRepo.CreateAcademicYear(model);
      return Success(_mapper.Map<AcademicYearDto>(result));
    }

    // DELETE: api/AcademicYears/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAcademicYear(int id)
    {
      var result = await _acaYearRepo.DeleteAcademicYear(id);
      return Success(result);
    }

    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _acaYearRepo.BulkDelete(ids);
      return Success(result);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcel(IFormFile file)
    {
      try
      {
        var result = await _acaYearRepo.ImportExcel(file);

        if (result.Contains("thành công") || result.Contains("Thành công"))
        {
          return Ok(result);
        }

        return BadRequest(result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Server Error: {ex.Message}");
      }
    }
  }
}
