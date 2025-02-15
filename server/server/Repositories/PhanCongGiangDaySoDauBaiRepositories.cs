using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Types.PhanCongGDBia;
using System.Text;

namespace server.Repositories
{
  public class PhanCongGiangDaySoDauBaiRepositories : IPhanCongGiangDaySoDauBai
  {
    private readonly SoDauBaiContext _context;

    public PhanCongGiangDaySoDauBaiRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<PhanCongGiangDayBiaResType> GetPC_GiangDay_BiaSDBs()
    {
      try
      {
        // Show nhung GV nao day lop nao   
        var query = @"SELECT pc.phanCongGiangDayId, 
                      pc.biaSoDauBaiId, 
                      pc.teacherId, 
                      pc.status, 
                      pc.dateCreated, 
                      pc.dateUpdated, 
                      t.fullname,
                      c.className,
                      c.classId
                      FROM PhanCongGiangDay as pc
                      LEFT JOIN TEACHER AS T ON pc.teacherId = T.teacherId
                      LEFT JOIN CLASS AS C ON t.teacherId = c.teacherId";

        var phancongSBD = await _context.PhanCongGiangDays
          .FromSqlRaw(query).Select(static x => new
          {
            x.BiaSoDauBaiId,
            x.PhanCongGiangDayId,
            x.TeacherId,
            x.Status,
            x.DateCreated,
            x.DateUpdated,
            teacherName = x.Teacher.Fullname,
            classId = x.Teacher.Classes.First().ClassId,
            className = x.Teacher.Classes.First().ClassName,
          })
          .ToListAsync() ?? throw new Exception("Empty");

        if (phancongSBD.Count == 0)
        {
          return new PhanCongGiangDayBiaResType(400, "Không có dữ liệu");
        }

        var result = phancongSBD.Select(x => new MapData
        {
          PhanCongGiangDayId = x.PhanCongGiangDayId,
          TeacherId = x.TeacherId,
          BiaSoDauBaiId = x.BiaSoDauBaiId,
          Status = x.Status,
          DateCreated = x.DateCreated,
          DateUpdated = x.DateUpdated,
          ClassId = x.classId,
          ClassName = x.className,
          Fullname = x.teacherName
        })
          .OrderBy(x => x.ClassId)
          .ToList();

        return new PhanCongGiangDayBiaResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new PhanCongGiangDayBiaResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<PhanCongGiangDayBiaResType> CreatePC_GiangDay_BiaSDB(PC_GiangDay_BiaSDBDto model)
    {
      try
      {
        if (model is null)
        {
          return new PhanCongGiangDayBiaResType(400, "Vui lòng điền đầy đủ thông tin");
        }

        // check teacher
        var findTeacher = "SELECT * FROM Teacher WHERE teacherId = @id";
        var teacherExists = await _context.Teachers
          .FromSqlRaw(findTeacher, new SqlParameter("@id", model.TeacherId))
          .FirstOrDefaultAsync();

        if (teacherExists is null)
        {
          return new PhanCongGiangDayBiaResType(404, "Teacher Not found");
        }

        //check PC_GiangDay_BiaSDB
        var find = "SELECT * FROM PhanCongGiangDay WHERE PhanCongGiangDayId = @id";

        var getClass = await _context.PhanCongGiangDays
          .FromSqlRaw(find, new SqlParameter("@id", model.PhanCongGiangDayId))
          .FirstOrDefaultAsync();

        if (getClass is not null)
        {
          return new PhanCongGiangDayBiaResType(409, "PC_GiangDay_BiaSDB already exists");
        }

        var sqlInsert = @"INSERT INTO PhanCongGiangDay (TeacherId, BiaSoDauBaiId, Status, DateCreated, DateUpdated)
                          VALUES (@TeacherId,@BiaSoDauBaiId, @Status, @DateCreated, @DateUpdated);
                          SELECT CAST(SCOPE_IDENTITY() as int);";

        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@TeacherId", model.TeacherId),
          new SqlParameter("@BiaSoDauBaiId", model.BiaSoDauBaiId),
          new SqlParameter("@Status", model.Status),
          new SqlParameter("@DateCreated", DateTime.UtcNow),
          new SqlParameter("@DateUpdated", DBNull.Value)
          );

        var result = new PC_GiangDay_BiaSDBDto
        {
          PhanCongGiangDayId = insert,
          TeacherId = model.TeacherId,
          BiaSoDauBaiId = model.BiaSoDauBaiId,
          Status = model.Status,
          DateCreated = DateTime.UtcNow,
          DateUpdated = null
        };

        return new PhanCongGiangDayBiaResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new PhanCongGiangDayBiaResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<PhanCongGiangDayBiaResType> GetPhanCongGiangDayByBia(int biaId)
    {
      try
      {
        if (biaId == 0)
        {
          return new PhanCongGiangDayBiaResType(400, "Vui lòng nhập mã bìa sổ đầu bài");
        }
        ;
        // Show nhung GV nao day lop nao   
        var query = @"SELECT pc.phanCongGiangDayId, 
                      pc.biaSoDauBaiId, 
                      pc.teacherId, 
                      pc.status, 
                      pc.dateCreated, 
                      pc.dateUpdated, 
                      t.fullname,
                      c.className,
                      c.classId
                      FROM PhanCongGiangDay as pc
                      LEFT JOIN TEACHER AS T 
                      ON pc.teacherId = T.teacherId
                      LEFT JOIN CLASS AS C ON t.teacherId = c.teacherId
                      WHERE pc.biaSoDauBaiId = @biaId";

        var phancongSBD = await _context.PhanCongGiangDays
          .FromSqlRaw(query, new SqlParameter("@biaId", biaId))
          .Select(static x => new
          {
            x.BiaSoDauBaiId,
            x.PhanCongGiangDayId,
            x.TeacherId,
            x.Status,
            x.DateCreated,
            x.DateUpdated,
            teacherName = x.Teacher.Fullname,
            classId = x.Teacher.Classes.First().ClassId,
            className = x.Teacher.Classes.First().ClassName,
          }).FirstOrDefaultAsync() ?? throw new Exception("Empty");

        if (phancongSBD is null)
        {
          return new PhanCongGiangDayBiaResType(404, "Không có dữ liệu");
        }

        var result = new MapData
        {
          PhanCongGiangDayId = phancongSBD.PhanCongGiangDayId,
          TeacherId = phancongSBD.TeacherId,
          BiaSoDauBaiId = phancongSBD.BiaSoDauBaiId,
          Status = phancongSBD.Status,
          DateCreated = phancongSBD.DateCreated,
          DateUpdated = phancongSBD.DateUpdated,
          ClassId = phancongSBD.classId,
          ClassName = phancongSBD.className,
          Fullname = phancongSBD.teacherName
        };

        return new PhanCongGiangDayBiaResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new PhanCongGiangDayBiaResType(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<PhanCongGiangDayBiaResType> GetPC_GiangDay_BiaSDB(int id)
    {
      try
      {
        var find = "SELECT * FROM PhanCongGiangDay WHERE phanCongGiangDayId  = @id";
        var phancongSDB = await _context.PhanCongGiangDays
          .AsNoTracking()
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .ToListAsync();

        if (phancongSDB is null)
        {
          return new PhanCongGiangDayBiaResType(404, "Không tìm thấy bản ghi phân công giảng dạy");
        }

        var result = new PC_GiangDay_BiaSDBDto
        {
          PhanCongGiangDayId = id,
          TeacherId = phancongSDB.TeacherId,
          BiaSoDauBaiId = phancongSDB.BiaSoDauBaiId,
          Status = phancongSDB.Status,
          DateCreated = phancongSDB.DateCreated,
          DateUpdated = phancongSDB.DateUpdated
        };

        return new PhanCongGiangDayBiaResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new PhanCongGiangDayBiaResType(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<PhanCongGiangDayBiaResType> ImportExcelFile(IFormFile file)
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
                  if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null)
                  {
                    // Stop processing when an empty row is encountered
                    break;
                  }

                  var myPhanCongGiangDay = new Models.PhanCongGiangDay
                  {
                    TeacherId = Convert.ToInt32(reader.GetValue(1)),
                    BiaSoDauBaiId = Convert.ToInt32(reader.GetValue(2)),
                    Status = Convert.ToBoolean(reader.GetValue(3)),
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = null
                  };

                  await _context.PhanCongGiangDays.AddAsync(myPhanCongGiangDay);
                  await _context.SaveChangesAsync();
                }
              } while (reader.NextResult());
            }
          }

          return new PhanCongGiangDayBiaResType(200, "Tải lên thành công.");
        }

        return new PhanCongGiangDayBiaResType(400, "No file uploaded");
      }
      catch (Exception ex)
      {
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<PhanCongGiangDayBiaResType> UpdatePC_GiangDay_BiaSDB(int id, PC_GiangDay_BiaSDBDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var find = "SELECT * FROM PhanCongGiangDay WHERE PhanCongGiangDayId = @id";

        var existingPhanCongGiangDay = await _context.PhanCongGiangDays
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (existingPhanCongGiangDay is null)
        {
          return new PhanCongGiangDayBiaResType(404, "Không tìm thấy Id");
        }

        bool hasChanges = false;

        var parameters = new List<SqlParameter>();
        var queryBuilder = new StringBuilder("UPDATE PhanCongGiangDay SET ");

        if (model.TeacherId != 0 && model.TeacherId != existingPhanCongGiangDay.TeacherId)
        {
          queryBuilder.Append("teacherId = @teacherId, ");
          parameters.Add(new SqlParameter("@teacherId", model.TeacherId));
          hasChanges = true;
        }

        if (model.BiaSoDauBaiId != 0 && model.BiaSoDauBaiId != existingPhanCongGiangDay.BiaSoDauBaiId)
        {
          queryBuilder.Append("biaSoDauBaiId = @biaSoDauBaiId, ");
          parameters.Add(new SqlParameter("@biaSoDauBaiId", model.BiaSoDauBaiId));
          hasChanges = true;
        }

        if (model.Status != existingPhanCongGiangDay.Status)
        {
          queryBuilder.Append("status = @status, ");
          parameters.Add(new SqlParameter("@status", model.Status));
          hasChanges = true;
        }

        if (hasChanges)
        {
          if (queryBuilder[^2] == ',')
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE PhanCongGiangDayId = @id");
          parameters.Add(new SqlParameter("@id", id));

          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);
          await transaction.CommitAsync();
          return new PhanCongGiangDayBiaResType(200, "Đã cập nhật");
        }
        else
        {
          return new PhanCongGiangDayBiaResType(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new PhanCongGiangDayBiaResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<PhanCongGiangDayBiaResType> DeletePC_GiangDay_BiaSDB(int id)
    {
      try
      {
        if (id == 0)
        {
          return new PhanCongGiangDayBiaResType(400, "Vui lòng nhập id");
        }
        var find = "SELECT * FROM PhanCongGiangDay WHERE PhanCongGiangDayId = @id";
        var getClass = await _context.PhanCongGiangDays
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (getClass is null)
        {
          return new PhanCongGiangDayBiaResType(404, "Không tìm thấy");
        }

        var deleteQuery = "DELETE FROM PhanCongGiangDay WHERE PhanCongGiangDayId = @id";

        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));

        return new PhanCongGiangDayBiaResType(200, "Xóa bản ghi thành công");
      }
      catch (Exception ex)
      {
        return new PhanCongGiangDayBiaResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<PhanCongGiangDayBiaResType> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        if (ids == null || ids.Count == 0)
        {
          return new PhanCongGiangDayBiaResType(400, "Vui lòng cung cấp Id");
        }

        var deleteQuery = "DELETE FROM PhanCongGiangDay WHERE PhanCongGiangDayId IN ({0})";
        var sqlParameters = ids.Select((id, index) => new SqlParameter($"@p{index}", id)).ToArray();
        var parameterPlaceholders = string.Join(",", sqlParameters.Select(p => p.ParameterName));
        deleteQuery = string.Format(deleteQuery, parameterPlaceholders);

        // Execute
        var affectedRows = await _context.Database.ExecuteSqlRawAsync(deleteQuery, sqlParameters);

        if (affectedRows == 0)
        {
          return new PhanCongGiangDayBiaResType(404, "Id không tồn tại");
        }

        await transaction.CommitAsync();

        return new PhanCongGiangDayBiaResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new PhanCongGiangDayBiaResType(500, $"Server error: {ex.Message}");
      }
    }

  }
}
