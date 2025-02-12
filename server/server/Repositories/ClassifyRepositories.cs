using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using System.Text;

namespace server.Repositories
{
  public class ClassifyRepositories : IClassify
  {
    private readonly SoDauBaiContext _context;

    public ClassifyRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<ClassifyDto>> CreateClassify(ClassifyDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var find = "SELECT * FROM CLASSIFICATION WHERE classificationId = @id";
        var classify = await _context.Classifications
          .FromSqlRaw(find, new SqlParameter("@id", model.ClassificationId))
          .FirstOrDefaultAsync();

        if (classify is not null)
        {
          return new ResponseData<ClassifyDto>(409, "classificationId already exists");
        }

        var query = @"INSERT INTO CLASSIFICATION (classifyName, score) 
                       VALUES (@classifyName, @score)";

        var insert = await _context.Database.ExecuteSqlRawAsync(query,
          new SqlParameter("@classifyName", model.ClassifyName),
          new SqlParameter("@score", model.Score)
          );

        await transaction.CommitAsync();

        var result = new ClassifyDto
        {
          ClassificationId = insert,
          ClassifyName = model.ClassifyName,
          Score = model.Score,
        };

        return new ResponseData<ClassifyDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<ClassifyDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<ClassifyDto>> GetClassify(int id)
    {
      try
      {
        var query = @"SELECT * from Classification where ClassificationId = @id";

        // Fetch 
        var student = await _context.Classifications
            .FromSqlRaw(query, new SqlParameter("@id", id))
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (student is null)
        {
          return new ResponseData<ClassifyDto>(404, "Xếp loại này không tồn tại");
        }

        // Map the result to the StudentDto
        var result = new ClassifyDto
        {
          ClassificationId = id,
          ClassifyName = student.ClassifyName,
          Score = student.Score,
        };

        return new ResponseData<ClassifyDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<ClassifyDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<ClassifyDto>>> GetClassifys()
    {
      try
      {
        var roles = await _context.Classifications
            .AsNoTracking()
            .ToListAsync();

        var result = roles.Select(x => new ClassifyDto
        {
          ClassificationId = x.ClassificationId,
          ClassifyName = x.ClassifyName,
          Score = x.Score,
        }).ToList();

        if (result.Count == 0)
        {
          return new ResponseData<List<ClassifyDto>>(400, "Không có dữ liệu", result);
        }

        return new ResponseData<List<ClassifyDto>>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<ClassifyDto>>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<ClassifyDto>> UpdateClassify(int id, ClassifyDto model)
    {
      using (var transaction = await _context.Database.BeginTransactionAsync())
      {
        try
        {
          var find = "SELECT * FROM Classification WHERE ClassificationId = @id";
          var exists = await _context.Classifications
            .FromSqlRaw(find, new SqlParameter("@id", id))
            .FirstOrDefaultAsync();

          if (exists == null)
          {
            return new ResponseData<ClassifyDto>(404, "Xếp loại không tồn tại");
          }

          bool hasChanges = false;

          var parameters = new List<SqlParameter>();
          var queryBuilder = new StringBuilder("UPDATE Classification SET ");

          if (!string.IsNullOrEmpty(model.ClassifyName) && model.ClassifyName != exists.ClassifyName)
          {
            queryBuilder.Append("ClassifyName = @ClassifyName, ");
            parameters.Add(new SqlParameter("@ClassifyName", model.ClassifyName));
            hasChanges = true;
          }

          if (model.Score != exists.Score)
          {
            queryBuilder.Append("Score = @Score, ");
            parameters.Add(new SqlParameter("@Score", model.Score));
            hasChanges = true;
          }

          // Remove the last comma and space
          if (queryBuilder.Length > 0)
          {
            queryBuilder.Length -= 2;
          }

          if (hasChanges)
          {
            queryBuilder.Append(" WHERE ClassificationId = @id");
            parameters.Add(new SqlParameter("@id", id));

            var updateQuery = queryBuilder.ToString();
            await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

            await transaction.CommitAsync();

            return new ResponseData<ClassifyDto>(200, "Cập nhật thành công");
          }
          else
          {
            return new ResponseData<ClassifyDto>(200, "Không phát hiện sự thay đổi");
          }
        }
        catch (Exception ex)
        {
          await transaction.RollbackAsync();
          return new ResponseData<ClassifyDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
          throw new Exception($"Server error: {ex.Message}");
        }
      }
    }

    public async Task<ResponseData<ClassifyDto>> DeleteClassify(int id)
    {
      try
      {
        var find = "SELECT * FROM Classification WHERE ClassificationId = @id";
        var Classify = await _context.Classifications
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (Classify is null)
        {
          return new ResponseData<ClassifyDto>(404, "Xếp loại không tồn tại");
        }

        var deleteQuery = "DELETE FROM Classification WHERE ClassificationId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));
        return new ResponseData<ClassifyDto>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<ClassifyDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ResponseData<string>(400, "Vui lòng cung cấp mã xếp loại");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM Classification WHERE ClassificationId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ResponseData<string>(404, "Mã xếp loại không tồn tại");
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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var myClassify = new Models.Classification
                {
                  ClassifyName = reader.GetValue(1).ToString() ?? "Xep loai",
                  Score = Convert.ToInt32(reader.GetValue(2)),
                };

                await _context.Classifications.AddAsync(myClassify);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(400, "Không có tệp nào được tải lên");

      }
      catch (Exception ex)
      {
        return new ResponseData<string>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }
  }
}
