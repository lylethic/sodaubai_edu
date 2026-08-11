using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;
using server.Types.Role;
using System.Text;
using AutoMapper;
using server.Applications.ResponseModel;
using server.Common.Exceptions;

namespace server.Repositories
{
  public class RoleRepositories : BaseRepository<Role>, IRole
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RoleRepositories(SoDauBaiContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    protected override IQueryable<Role> ApplySearchFilter(IQueryable<Role> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.NameRole.Contains(searchTerm) || x.Description.Contains(searchTerm));
    }

    public async Task<PaginatedResponse<Role>> GetRoles(QueryObject request)
    {
      var result = await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);

      return new PaginatedResponse<Role>
      {
        Items = result.Items,
        PageNumber = result.PageNumber,
        PageSize = result.PageSize,
        TotalCount = result.TotalCount
      };
    }

    public async Task<Role> GetRole(int id)
    {
      var result = await GetByIdAsync(id) ?? throw new NotFoundException("Role not found");
      return result;
    }

    public async Task<Role> AddRole(RoleDto model)
    {
      var dto = _mapper.Map<Role>(model);
      dto.CreatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);
      return await this.AddAsync(dto);
    }

    public async Task<bool> DeleteRole(int id)
    {
      return await this.SoftDeleteAsync(id);
    }

    public async Task<Role> UpdateRole(int id, RoleDto model)
    {
      var existing = await GetByIdAsync(id);
      if (existing == null) throw new NotFoundException("Không tìm thấy dữ liệu");

      if (!string.IsNullOrEmpty(model.NameRole)) existing.NameRole = model.NameRole;
      if (model.Description != null) existing.Description = model.Description;

      existing.DateUpdated = DateTime.UtcNow;
      existing.UpdatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);

      return await this.UpdateAsync(existing);
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var result = await BulkDeleteAsync(ids);
        await transaction.CommitAsync();

        return true;
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return false;
      }
    }

    public async Task<string> ImportExcel(IFormFile file)
    {
      try
      {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        if (file is not null && file.Length > 0)
        {
          var uploadsFolder = $"{Directory.GetCurrentDirectory()}\\Uploads";

          if (!Directory.Exists(uploadsFolder))
          {
            Directory.CreateDirectory(uploadsFolder);
          }

          var filePath = Path.Combine(uploadsFolder, file.FileName);
          using (var stream = new FileStream(filePath, FileMode.Create))
          {
            await file.CopyToAsync(stream);
          }

          using (var stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read))
          {
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
              bool isHeaderSkipped = false;

              do
              {
                while (reader.Read())
                {
                  if (!isHeaderSkipped)
                  {
                    isHeaderSkipped = true;
                    continue;
                  }

                  // Check if there are no more rows or empty rows
                  if (reader.GetValue(1) == null && reader.GetValue(2) == null)
                  {
                    // Stop processing when an empty row is encountered
                    break;
                  }

                  var myRole = new Models.Role
                  {
                    NameRole = reader.GetValue(1).ToString() ?? "role",
                    Description = reader.GetValue(2).ToString() ?? "Mo ta"
                  };


                  await _context.Roles.AddAsync(myRole);
                  await _context.SaveChangesAsync();
                }
              } while (reader.NextResult());
            }
          }

          return "Tải lên thành công";
        }
        return "No file uploaded";

      }
      catch (Exception ex)
      {
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<RoleResType> ExportRolesExcel(List<int> ids, string filePath)
    {
      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new RoleResType(400, "Không có id nào!");
        }

        Console.WriteLine($"ID: {string.Join(",", ids)}");

        var roles = await _context.Roles
          .Where(x => ids.Contains(x.Id))
          .ToListAsync();

        if (roles is null || !roles.Any())
        {
          return new RoleResType(404, "Không tìm thấy id");
        }

        using (var workbook = new XLWorkbook())
        {
          var worksheet = workbook.Worksheets.Add("Roles");

          // Add headers: 1 row => 3 columns
          worksheet.Cell(1, 1).Value = "Mã vai trò";
          worksheet.Cell(1, 2).Value = "Tên vai trò";
          worksheet.Cell(1, 3).Value = "Mô tả";

          // Add body data: by row
          for (int i = 0; i < roles.Count; i++)
          {
            var role = roles[i];
            worksheet.Cell(i + 2, 1).Value = role.Id;
            worksheet.Cell(i + 2, 2).Value = role.NameRole;
            worksheet.Cell(i + 2, 3).Value = role.Description;
          }

          // Fit columns
          worksheet.Columns().AdjustToContents();

          // Save
          workbook.SaveAs(filePath);
        }

        return new RoleResType(200, "Thành công");
      }
      catch (Exception ex)
      {
        return new RoleResType(500, $"Server error: {ex.Message}");
      }
    }
  }
}
