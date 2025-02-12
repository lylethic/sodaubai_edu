using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Types.Role;
using System.Text;

namespace server.Repositories
{
  public class RoleRepositories : IRole
  {
    private readonly SoDauBaiContext _context;

    public RoleRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<RoleResType> GetRole(int id)
    {
      try
      {
        var query = @"SELECT * 
                      FROM ROLE 
                      WHERE RoleId = @id";

        var role = await _context.Roles
          .FromSqlRaw(query, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (role is null)
        {
          return new RoleResType
          {
            StatusCode = 404,
            Message = "Lỗi xảy ra khi xác thực dữ liệu...",
            Errors =
             [
               new("RoleId", "Không tìm thấy")
             ]
          };
        }

        var result = new RoleDto
        {
          RoleId = id,
          NameRole = role.NameRole,
          Description = role.Description,
        };

        return new RoleResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new RoleResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<RoleResType> GetRoles()
    {
      try
      {
        var query = @"SELECT * FROM Role
                      ORDER BY RoleId ";

        var roles = await _context.Roles
          .FromSqlRaw(query)
          .AsNoTracking()
          .ToListAsync() ?? throw new Exception("Empty");

        var result = roles.Select(x => new RoleDto
        {
          RoleId = x.RoleId,
          NameRole = x.NameRole,
          Description = x.Description,
        }).ToList();

        return new RoleResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new RoleResType(500, $"Có lỗi: {ex.Message}");
      }
    }

    public async Task<RoleResType> GetRolesNoPagnination()
    {
      try
      {

        var query = @"SELECT * FROM Role";

        var roles = await _context.Roles
          .FromSqlRaw(query)
          .ToListAsync() ?? throw new Exception("Empty");

        var result = roles.Select(x => new RoleDto
        {
          RoleId = x.RoleId,
          NameRole = x.NameRole,
          Description = x.Description,

        }).ToList();

        return new RoleResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new RoleResType(500, $"Có lỗi: {ex.Message}");
      }
    }

    public async Task<RoleResType> AddRole(RoleDto model)
    {
      try
      {
        var findRole = "SELECT * FROM ROLE WHERE RoleId = @roleId";

        var role = await _context.Roles
          .FromSqlRaw(findRole, new SqlParameter("@roleId", model.RoleId))
          .FirstOrDefaultAsync();

        if (role is not null)
        {
          return new RoleResType
          {
            StatusCode = 409,
            Message = "Lỗi xảy ra khi xác thực dữ liệu...",
            Errors =
            [
              new("NameRole", "Vai trò đã tồn tại")
            ]
          };
        }

        var sqlInsert = @"INSERT INTO ROLE (NameRole, Description) 
                          VALUES (@NameRole, @Description);
                          SELECT CAST(SCOPE_IDENTITY() as int);";

        var roleInsert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@NameRole", model.NameRole),
          new SqlParameter("@Description", model.Description)
        );

        var result = new RoleDto
        {
          RoleId = roleInsert,
          NameRole = model.NameRole,
          Description = model.Description,
        };

        return new RoleResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new RoleResType(200, $"Server error: {ex.Message}");
      }
    }

    public async Task<RoleResType> DeleteRole(int id)
    {
      try
      {
        var findRole = "SELECT * FROM ROLE WHERE RoleId = @id";
        var role = await _context.Roles
          .FromSqlRaw(findRole, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (role is null)
        {
          return new RoleResType
          {
            StatusCode = 404,
            Message = "Lỗi xảy ra khi xác thực dữ liệu...",
            Errors =
             [
               new("RoleId", "Vai trò không tìm thấy")
             ]
          };
        }

        var deleteQuery = "DELETE FROM ROLE WHERE RoleId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));
        return new RoleResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new RoleResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<RoleResType> UpdateRole(int id, RoleDto model)
    {
      try
      {
        var findRole = "SELECT * FROM ROLE WHERE RoleId = @id";
        var existingRole = await _context.Roles
          .FromSqlRaw(findRole, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (existingRole is null)
        {
          return new RoleResType
          {
            StatusCode = 404,
            Message = "Lỗi xảy ra khi xác thực dữ liệu...",
            Errors =
             [
               new("RoleId", "Vai trò không tìm thấy")
             ]
          };
        }

        // flag
        bool hasChanges = false;

        var queryBuilder = new StringBuilder("UPDATE ROLE SET ");
        var parameters = new List<SqlParameter>();

        if (!string.IsNullOrEmpty(model.NameRole) && model.NameRole != existingRole.NameRole)
        {
          queryBuilder.Append("NameRole = @NameRole, ");
          parameters.Add(new SqlParameter("@NameRole", model.NameRole));
          hasChanges = true;
        }

        if (existingRole.Description != model.Description)
        {
          queryBuilder.Append("Description = @Description, ");
          parameters.Add(new SqlParameter("@Description", model.Description));
          hasChanges = true;
        }

        if (hasChanges)
        {
          // Remove the last comma and space
          if (queryBuilder.Length > 0)
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE RoleId = @id");
          parameters.Add(new SqlParameter("@id", id));

          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          return new RoleResType(200, "Cập nhật thành công");
        }
        else
        {
          return new RoleResType(200, "No changes detected");
        }
      }
      catch (Exception ex)
      {
        return new RoleResType(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<RoleResType> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new RoleResType(400, "No IDs provided.");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM Role WHERE RoleId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new RoleResType(404, "No RoleId found to delete");
        }

        await transaction.CommitAsync();

        return new RoleResType(200, "Deleted succesfully");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new RoleResType(500, $"Server error: {ex.Message}");
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
          .Where(x => ids.Contains(x.RoleId))
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
            worksheet.Cell(i + 2, 1).Value = role.RoleId;
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

    public async Task<int> GetCountRoles()
    {
      try
      {
        var role = await _context.Roles.CountAsync();
        return role;
      }
      catch (Exception ex)
      {
        throw new Exception($"Error: {ex.Message}");
      }
    }
  }
}
