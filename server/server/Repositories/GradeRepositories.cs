using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using System.Text;

namespace server.Repositories
{
  public class GradeRepositories : IGrade
  {
    readonly SoDauBaiContext _context;

    public GradeRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<GradeDto>> CreateGrade(GradeDto model)
    {
      if (model is null) return new ResponseData<GradeDto>(400, "Vui lòng cung cấp mã khối lớp hợp lệ");

      try
      {
        // check academic
        var findAcademic = "SELECT * FROM AcademicYear WHERE AcademicYearId = @id";
        var acaExists = await _context.AcademicYears
          .FromSqlRaw(findAcademic, new SqlParameter("@id", model.AcademicYearId))
          .FirstOrDefaultAsync();

        if (acaExists is null)
        {
          return new ResponseData<GradeDto>(404, "Năm học không tồn tại");
        }

        //check grade
        var find = "SELECT * FROM Grade WHERE GradeId = @id";
        var grade = await _context.Grades
          .FromSqlRaw(find, new SqlParameter("@id", model.GradeId))
          .FirstOrDefaultAsync();

        if (grade is not null)
        {
          return new ResponseData<GradeDto>(409, "Khối lớp này đã tồn tại");
        }

        var sqlInsert = @"INSERT INTO Grade (academicYearId, gradeName, description, dateCreated, dateUpdated)
                          VALUES (@academicYearId, @gradeName, @description, @dateCreated, @dateUpdated);
                          SELECT CAST(SCOPE_IDENTITY() as int);";

        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@academicYearId", model.AcademicYearId),
          new SqlParameter("@gradeName", model.GradeName),
          new SqlParameter("@description", model.Description),
          new SqlParameter("@dateCreated", DateTime.UtcNow),
          new SqlParameter("@dateUpdated", DBNull.Value)
          );

        var result = new GradeDto
        {
          AcademicYearId = model.AcademicYearId,
          GradeName = model.GradeName,
          Description = model.Description,
          DateCreated = model.DateCreated,
          DateUpdated = model.DateUpdated,
        };

        return new ResponseData<GradeDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<GradeDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<GradeDetail>> GetGrade(int id)
    {
      if (id == 0) return new ResponseData<GradeDetail>(400, "Vui lòng cung cấp mã khối lớp hợp lệ");
      try
      {
        var find = @"SELECT g.gradeId, g.gradeName, g.description, g.dateCreated, g.dateUpdated,
                            a.academicYearId, a.displayAcademicYear_Name, a.yearStart, a.yearEnd
                     FROM GRADE as g inner join AcademicYear as a on g.academicYearId = a.academicYearId
                     WHERE GradeId = @id";

        var grade = await _context.Grades
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .Select(static x => new
          {
            x.GradeId,
            x.GradeName,
            x.Description,
            x.DateCreated,
            x.DateUpdated,
            x.AcademicYearId,
            displayName = x.AcademicYear.DisplayAcademicYearName,
            yearStart = x.AcademicYear.YearStart,
            yearEnd = x.AcademicYear.YearEnd,
          })
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (grade is null)
        {
          return new ResponseData<GradeDetail>(404, "Khối lớp này không tồn tại");
        }

        var result = new GradeDetail
        {
          GradeId = id,
          GradeName = grade.GradeName,
          Description = grade.Description,
          DateCreated = grade.DateCreated,
          DateUpdated = grade.DateUpdated,
          AcademicYearId = grade.AcademicYearId,
          DisplayAcademicYearName = grade.displayName,
          YearStart = grade.yearStart,
          YearEnd = grade.yearEnd,
        };

        return new ResponseData<GradeDetail>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<GradeDetail>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<GradeDetail>>> GetGrades()
    {
      try
      {
        var find = @"SELECT g.*, a.displayAcademicYear_Name, a.yearStart, a.yearEnd
                     FROM GRADE as g LEFT JOIN AcademicYear as a on g.academicYearId = a.academicYearId";

        var grade = await _context.Grades
          .FromSqlRaw(find)
          .Select(static x => new
          {
            x.GradeId,
            x.AcademicYearId,
            x.AcademicYear.DisplayAcademicYearName,
            x.AcademicYear.YearStart,
            x.AcademicYear.YearEnd,
            x.GradeName,
            x.Description,
            x.DateCreated,
            x.DateUpdated
          })
          .AsNoTracking()
          .ToListAsync() ?? throw new Exception("Empty");

        var result = grade.Select(x => new GradeDetail
        {
          GradeId = x.GradeId,
          AcademicYearId = x.AcademicYearId,
          DisplayAcademicYearName = x.DisplayAcademicYearName,
          YearStart = x.YearStart,
          YearEnd = x.YearEnd,
          GradeName = x.GradeName,
          Description = x.Description,
          DateCreated = x.DateCreated,
          DateUpdated = x.DateUpdated
        }).ToList();

        return new ResponseData<List<GradeDetail>>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<GradeDetail>>(500, $"Server error: {ex.Message}");
        throw new Exception($"Server Error: {ex.Message}");
      }
    }

    public async Task<ResponseData<GradeDto>> UpdateGrade(int id, GradeDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        var find = "SELECT * FROM Grade WHERE GradeId = @id";

        var existingGrade = await _context.Grades
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (existingGrade is null)
        {
          return new ResponseData<GradeDto>(404, "Grade not found");
        }

        bool hasChanges = false;

        var queryBuilder = new StringBuilder("UPDATE Grade SET ");
        var parameters = new List<SqlParameter>();

        if (model.AcademicYearId != 0 && model.AcademicYearId != existingGrade.AcademicYearId)
        {
          queryBuilder.Append("AcademicYearId = @AcademicYearId, ");
          parameters.Add(new SqlParameter("@AcademicYearId", model.AcademicYearId));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.GradeName) && model.GradeName != existingGrade.GradeName)
        {
          queryBuilder.Append("GradeName = @GradeName, ");
          parameters.Add(new SqlParameter("@GradeName", model.GradeName));
          hasChanges |= true;
        }
        if (model.Description != existingGrade.Description)
        {
          queryBuilder.Append("Description = @Description, ");
          parameters.Add(new SqlParameter("@Description", model.Description));
          hasChanges = true;
        }

        if (model.DateCreated.HasValue)
        {
          queryBuilder.Append("DateCreated = @DateCreated, ");
          parameters.Add(new SqlParameter("@DateCreated", model.DateCreated.Value));
        }

        if (existingGrade.DateUpdated != DateTime.UtcNow)
        {
          queryBuilder.Append("DateUpdated = @DateUpdated, ");
          parameters.Add(new SqlParameter("@DateUpdated", DateTime.UtcNow));
          hasChanges = true;
        }

        if (hasChanges)
        {
          if (queryBuilder[^2] == ',')
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE GradeId = @id");
          parameters.Add(new SqlParameter("@id", id));

          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          await transaction.CommitAsync();
          return new ResponseData<GradeDto>(200, "Cập nhật thành công");
        }
        else
        {
          return new ResponseData<GradeDto>(200, "Không có sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<GradeDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<GradeDto>> DeleteGrade(int id)
    {
      try
      {
        var find = "SELECT * FROM Grade WHERE GradeId = @id";

        var grade = await _context.Grades
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (grade is null)
        {
          return new ResponseData<GradeDto>(404, "Khối lớp không tồn tại");
        }

        var deleteQuery = "DELETE FROM Grade WHERE GradeId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));

        return new ResponseData<GradeDto>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<GradeDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        if (ids == null || ids.Count == 0)
        {
          return new ResponseData<string>(400, "Vui lòng cung cấp mã khối lớp hợp lệ");
        }

        // Create a comma-separated list of IDs for the SQL query
        var idList = string.Join(",", ids);

        // Prepare the delete query with parameterized input
        var deleteQuery = $"DELETE FROM Grade WHERE GradeId IN ({idList})";

        // Execute
        var affectedRows = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (affectedRows == 0)
        {
          return new ResponseData<string>(404, "Mã khối lớp không tồn tại");
        }

        await transaction.CommitAsync();

        return new ResponseData<string>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<string>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> ImportExcelFile(IFormFile file)
    {
      try
      {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

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

          using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read))
          {
            using var reader = ExcelReaderFactory.CreateReader(stream);

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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }
                var acaId = Convert.ToInt16(reader.GetValue(1));
                var acadExisting = await _context.AcademicYears.AnyAsync(x => x.AcademicYearId == acaId);

                var myGrades = new Models.Grade
                {
                  AcademicYearId = acaId,
                  GradeName = reader.GetValue(2).ToString()?.Trim() ?? "Khoi lop",
                  Description = reader.GetValue(3).ToString()?.Trim() ?? "Mo Ta",
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null
                };

                await _context.Grades.AddAsync(myGrades);
              }
              await _context.SaveChangesAsync();
            } while (reader.NextResult());
          }
          return new ResponseData<string>(200, "Tải lên thành công.");
        }
        return new ResponseData<string>(400, "Không có tệp nào được tải lên");
      }
      catch (Exception ex)
      {
        return new ResponseData<string>(500, $"Error while uploading file: {ex.Message}");
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }
  }
}
