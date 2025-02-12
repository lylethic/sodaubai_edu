using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.IService;

namespace server.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize]
  public class RolesController : ControllerBase
  {
    private readonly IRole _roleRepo;

    public RolesController(IRole roleRepo)
    {
      _roleRepo = roleRepo;
    }

    [HttpGet("count-number-of-roles")]
    public async Task<IActionResult> GetCountAccounts()
    {
      var result = await _roleRepo.GetCountRoles();
      return Ok(result);
    }

    // GET: api/Roles`  
    [HttpGet]
    public async Task<IActionResult> GetRoles(QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();
      var result = await _roleRepo.GetRoles();

      if (result.StatusCode == 200)
      {
        var data = result.RoleData ?? [];
        var totalResults = data.Count;
        var totalPages = (int)Math.Ceiling((double)totalResults / queryObject.PageSize);
        var paginagedData = data
        .Skip((queryObject.PageNumber - 1) * queryObject.PageSize)
        .Take(queryObject.PageSize)
        .ToList();

        return StatusCode(200, new
        {
          status = result.StatusCode,
          message = result.Message,
          data = paginagedData,
          pagination = new
          {
            queryObject.PageNumber,
            queryObject.PageSize,
            totalResults,
            totalPages
          }
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    [HttpGet("get-roles-no-pagination")]
    public async Task<IActionResult> GetRolesNoPagination()
    {
      try
      {
        var result = await _roleRepo.GetRolesNoPagnination();

        if (result.StatusCode == 200)
        {
          return StatusCode(200, new
          {
            statusCode = result.StatusCode,
            message = result.Message,
            data = result.RoleData
          });
        }

        return StatusCode(500, result);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Server error: {ex.Message}");
      }
    }

    // GET: api/Roles/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetRole(int id)
    {
      var result = await _roleRepo.GetRole(id);

      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.RolebyId
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    // PUT: api/Roles/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRole(int id, RoleDto role)
    {
      var result = await _roleRepo.UpdateRole(id, role);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
        });
      }

      return Ok(result);
    }

    // POST: api/Roles
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpPost]
    public async Task<IActionResult> Create(RoleDto role)
    {
      var result = await _roleRepo.AddRole(role);
      if (result.StatusCode == 200)
      {
        return Ok(new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          data = result.RoleData
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message
      });
    }

    // DELETE: api/Roles/5
    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
      var result = await _roleRepo.DeleteRole(id);

      if (result.StatusCode == 404)
      {
        return StatusCode(404, new
        {
          statusCode = result.StatusCode,
          message = result.Message,
          error = result.Errors
        });
      }

      if (result.StatusCode == 200)
      {
        return StatusCode(200, new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      return StatusCode(500, new
      {
        statusCode = result.StatusCode,
        message = result.Message,
      });

    }

    [Authorize(Policy = "SuperAdminAndAdmin")]
    [HttpDelete("bulkdelete")]
    public async Task<IActionResult> BulkDelete(List<int> ids)
    {
      var result = await _roleRepo.BulkDelete(ids);

      if (result.StatusCode == 200)
      {
        return StatusCode(200, new
        {
          statusCode = result.StatusCode,
          message = result.Message
        });
      }

      if (result.StatusCode == 404)
      {
        return StatusCode(404, new
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

    [Authorize(Policy = "SuperAdminAndAdmin")]
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

    [Authorize(Policy = "SuperAdminAndAdmin")]
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
