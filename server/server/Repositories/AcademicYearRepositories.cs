using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using System.Text;

namespace server.Repositories
{
  public class AcademicYearRepositories : IAcademicYear
  {
    private readonly SoDauBaiContext _context;

    public AcademicYearRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<AcademicYearDto>> CreateAcademicYear(AcademicYearDto model)
    {
      try
      {
        var find = "SELECT * FROM AcademicYear WHERE academicYearId = @id";

        var academicYear = await _context.AcademicYears
          .FromSqlRaw(find, new SqlParameter("@id", model.AcademicYearId))
          .FirstOrDefaultAsync();

        if (academicYear is not null)
        {
          return new ResponseData<AcademicYearDto>(409, "Năm học đã tồn tại");
        }

        var sqlInsert = @"INSERT INTO AcademicYear (displayAcademicYear_Name, YearStart, YearEnd, Description, Status) 
                          VALUES (@displayAcademicYear_Name, @YearStart ,@YearEnd, @Description, @Status);
                          SELECT CAST(SCOPE_IDENTITY() as int);"
        ;


        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@AcademicYearId", model.AcademicYearId),
          new SqlParameter("@displayAcademicYear_Name", model.DisplayAcademicYearName),
          new SqlParameter("@YearStart", model.YearStart),
          new SqlParameter("@YearEnd", model.YearEnd),
          new SqlParameter("@Description", model.Description),
          new SqlParameter("@Status", model.Status)
        );

        var result = new AcademicYearDto
        {
          AcademicYearId = insert,
          DisplayAcademicYearName = model.DisplayAcademicYearName,
          YearStart = model.YearStart,
          YearEnd = model.YearEnd,
          Description = model.Description,
          Status = model.Status,
        };

        return new ResponseData<AcademicYearDto>(200, "Tạo mới thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<AcademicYearDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<AcademicYearDto>> GetAcademicYear(int id)
    {
      try
      {
        var find = "SELECT * FROM AcademicYear WHERE academicYearId = @id";
        var academicYear = await _context.AcademicYears
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (academicYear is null)
        {
          return new ResponseData<AcademicYearDto>(404, "Không tìm thấy năm học");
        }

        var result = new AcademicYearDto
        {
          AcademicYearId = id,
          DisplayAcademicYearName = academicYear.DisplayAcademicYearName,
          YearStart = academicYear.YearStart,
          YearEnd = academicYear.YearEnd,
          Description = academicYear.Description,
          Status = academicYear.Status,
        };

        return new ResponseData<AcademicYearDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<AcademicYearDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<AcademicYearDto>>> GetAcademicYears()
    {
      try
      {
        var countAllAcademicYear = _context.AcademicYears
        .AsNoTracking()
        .AsQueryable();

        int totalResults = await countAllAcademicYear.CountAsync();

        var query = @"SELECT * 
                    FROM AcademicYear
                    ORDER BY YearEnd DESC";

        var academicYear = await _context.AcademicYears
          .FromSqlRaw(query)
          .AsNoTracking()
          .ToListAsync() ?? throw new Exception("Empty");

        var result = academicYear.Select(x => new AcademicYearDto
        {
          AcademicYearId = x.AcademicYearId,
          DisplayAcademicYearName = x.DisplayAcademicYearName,
          YearStart = x.YearStart,
          YearEnd = x.YearEnd,
          Description = x.Description,
          Status = x.Status,
        }).ToList();

        return new ResponseData<List<AcademicYearDto>>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<AcademicYearDto>>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<AcademicYearDto>> UpdateAcademicYear(int id, AcademicYearDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        // Check if exists in the database
        var findQuery = "SELECT * FROM AcademicYear WHERE academicYearId = @id";
        var existingAca = await _context.AcademicYears
            .FromSqlRaw(findQuery, new SqlParameter("@id", id))
            .FirstOrDefaultAsync();

        if (existingAca == null)
        {
          return new ResponseData<AcademicYearDto>(404, "Không tìm thấy năm học");
        }

        bool hasChanges = false;

        // Build update query dynamically based on non-null fields
        var queryBuilder = new StringBuilder("UPDATE AcademicYear SET ");
        var parameters = new List<SqlParameter>();

        if (!string.IsNullOrEmpty(model.DisplayAcademicYearName) && model.DisplayAcademicYearName != existingAca.DisplayAcademicYearName)
        {
          queryBuilder.Append("DisplayAcademicYear_Name = @DisplayAcademicYear_Name, ");
          parameters.Add(new SqlParameter("@DisplayAcademicYear_Name", model.DisplayAcademicYearName));
          hasChanges = true;
        }

        if (model.YearStart != existingAca.YearStart)
        {
          queryBuilder.Append("YearStart = @YearStart, ");
          parameters.Add(new SqlParameter("@YearStart", model.YearStart));
          hasChanges = true;
        }

        if (model.YearEnd != existingAca.YearEnd)
        {
          queryBuilder.Append("YearEnd = @YearEnd, ");
          parameters.Add(new SqlParameter("@YearEnd", model.YearEnd));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.Description) && model.Description != existingAca.Description)
        {
          queryBuilder.Append("Description = @Description, ");
          parameters.Add(new SqlParameter("@Description", model.Description));
          hasChanges = true;
        }

        if (model.Status != existingAca.Status)
        {
          queryBuilder.Append("Status = @Status, ");
          parameters.Add(new SqlParameter("@Status", model.Status));
          hasChanges = true;
        }

        if (hasChanges)
        {
          // Remove trailing comma from the query if necessary
          if (queryBuilder[^2] == ',')
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE academicYearId = @id");
          parameters.Add(new SqlParameter("@id", id));

          // Execute the update query
          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);
          await transaction.CommitAsync();
          return new ResponseData<AcademicYearDto>(200, "Cập nhật thành công");
        }
        else
        {
          return new ResponseData<AcademicYearDto>(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<AcademicYearDto>(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> ImportExcel(IFormFile file)
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
                  if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null
                  && reader.GetValue(4) == null && reader.GetValue(5) == null)
                  {
                    // Stop processing when an empty row is encountered
                    break;
                  }

                  var myAcademicYear = new Models.AcademicYear
                  {
                    DisplayAcademicYearName = reader.GetValue(1).ToString() ?? "null",
                    YearStart = Convert.ToDateTime(reader.GetValue(2)),
                    YearEnd = Convert.ToDateTime(reader.GetValue(3)),
                    Description = reader.GetValue(4).ToString() ?? "null",
                    Status = Convert.ToBoolean(reader.GetValue(5))
                  };

                  await _context.AcademicYears.AddAsync(myAcademicYear);
                  await _context.SaveChangesAsync();
                }
              } while (reader.NextResult());
            }
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(204, "No file uploaded");

      }
      catch (Exception ex)
      {
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<ResponseData<AcademicYearDto>> DeleteAcademicYear(int id)
    {
      try
      {
        var find = "SELECT * FROM AcademicYear WHERE AcademicYearId = @id";
        var academicYear = await _context.AcademicYears
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (academicYear is null)
        {
          return new ResponseData<AcademicYearDto>(404, "AcademicYear not found");
        }

        var deleteQuery = "DELETE FROM AcademicYear WHERE AcademicYearId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));
        return new ResponseData<AcademicYearDto>(200, "Deleted");
      }
      catch (Exception ex)
      {
        return new ResponseData<AcademicYearDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ResponseData<string>(400, "Không có id nào được nhập");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM AcademicYear WHERE AcademicYearId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ResponseData<string>(404, "Không tìm thấy năm học");
        }

        await transaction.CommitAsync();

        return new ResponseData<string>(200, "Đã xóa");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<string>(500, $"Server error: {ex.Message}");
      }
    }
  }
}
