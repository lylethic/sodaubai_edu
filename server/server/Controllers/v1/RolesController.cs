using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Applications;
using server.Applications.ResponseModel;
using server.Common.Settings;
using server.Dtos;
using server.Interfaces;
using server.IService;

namespace server.Controllers.v1
{
  [ApiVersion("1.0")]
  [Route("api/v{version:apiVersion}/[controller]")]
  [Authorize]
  public class RolesController : BaseApiController
  {
    private readonly IRole _roleRepo;

    public RolesController(IMapper mapper, IHttpContextAccessor httpContextAccessor, ILogManager logger, IRole roleRepo) : base(mapper, httpContextAccessor, logger)
    {
      _roleRepo = roleRepo;
      _mapper = mapper;
    }

    // GET: api/Roles`  
    [HttpGet]
    public async Task<IActionResult> GetRoles([FromQuery] QueryObject request)
    {
      try
      {
        var result = await _roleRepo.GetRoles(request);
        var data = new PaginatedResponse<RoleDto>
        {
          Items = _mapper.Map<IEnumerable<RoleDto>>(result.Items),
          TotalCount = result.TotalCount,
          PageNumber = result.PageNumber,
          PageSize = result.PageSize
        };
        return Success(data);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // GET: api/Roles/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRole(int id)
    {
      try
      {
        var result = await _roleRepo.GetRole(id);
        return Success(_mapper.Map<RoleDto>(result));
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // PUT: api/Roles/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRole(int id, RoleDto role)
    {
      var result = await _roleRepo.UpdateRole(id, role);
      return Success(_mapper.Map<RoleDto>(result));
    }

    // POST: api/Roles
    [RequirePermission("CREATE")]
    [HttpPost]
    public async Task<IActionResult> Create(RoleDto role)
    {
      try
      {
        var result = await _roleRepo.AddRole(role);
        return Success(_mapper.Map<RoleDto>(result));
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    // DELETE: api/Roles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
      var result = await _roleRepo.DeleteRole(id);
      return Success(result);
    }

    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      try
      {
        var result = await _roleRepo.BulkDelete(ids);
        return Success(result);
      }
      catch (Exception ex)
      {
        return Error(ex);
      }
    }

    [HttpPost("upload")]
    public async Task<IActionResult> ImportExcelFile(IFormFile file)
    {
      try
      {
        var result = await _roleRepo.ImportExcel(file);

        if (result.Contains("Thành côngy"))
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

    [HttpPost("export")]
    public async Task<IActionResult> ExportRoles([FromBody] List<int> ids)
    {
      var exportFolder = Path.Combine(Directory.GetCurrentDirectory(), "Exports");

      // Ensure the directory exists
      if (!Directory.Exists(exportFolder))
      {
        Directory.CreateDirectory(exportFolder);
      }

      var filePath = Path.Combine(exportFolder, "Roles.xlsx");

      var result = await _roleRepo.ExportRolesExcel(ids, filePath);

      if (result.StatusCode != 200)
      {
        return BadRequest(result);
      }

      // Return file for download after successful export
      var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
      var fileName = "Roles.xlsx";

      return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }
  }
}
