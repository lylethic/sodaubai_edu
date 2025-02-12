using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;
using server.Types.Teacher;
using System.Text;

namespace server.Repositories
{
  public class TeacherRepositories : IService.ITeacher
  {
    private readonly SoDauBaiContext _context;
    private readonly IPhotoService _photo;

    public TeacherRepositories(SoDauBaiContext context, IPhotoService photo)
    {
      this._context = context;
      this._photo = photo;
    }

    public async Task<TeacherResType> GetTeacher(int id)
    {
      try
      {
        var findTeacher = @"SELECT t.teacherId, t.accountId, t.fullname, 
                                t.dateOfBirth, t.gender, t.address, t.status,
			                          s.schoolId, s.NameSchool, s.schoolType, t.dateCreate,
			                          t.dateUpdate, t.photoPath
                            FROM TEACHER T
                            LEFT JOIN SCHOOL S
                            ON T.schoolId = S.schoolId
                            WHERE T.teacherId = @id";

        var teacher = await _context.Teachers
          .FromSqlRaw(findTeacher, new SqlParameter("@id", id))
          .Select(static x => new Teacher
          {
            TeacherId = x.TeacherId,
            AccountId = x.AccountId,
            Fullname = x.Fullname,
            DateOfBirth = x.DateOfBirth,
            Gender = x.Gender,
            Address = x.Address,
            Status = x.Status,
            SchoolId = x.SchoolId,
            School = new School
            {
              NameSchool = x.School.NameSchool,
              SchoolType = x.School.SchoolType
            },
            DateCreate = x.DateCreate,
            DateUpdate = x.DateUpdate,
            PhotoPath = x.PhotoPath,
          })
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (teacher is null)
        {
          return new TeacherResType(404, "Không tìm thấy giáo viên");
        }

        var result = new TeacherDetail
        {
          TeacherId = id,
          AccountId = teacher.AccountId,
          Fullname = teacher.Fullname,
          DateOfBirth = teacher.DateOfBirth.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          Gender = teacher.Gender ? "Nam" : "Nữ",
          Address = teacher.Address,
          Status = teacher.Status,
          SchoolId = teacher.SchoolId,
          NameSchool = teacher.School.NameSchool,
          SchoolType = teacher.School.SchoolType,
          DateCreate = teacher.DateCreate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          DateUpdate = teacher.DateUpdate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          PhotoPath = teacher.PhotoPath,
        };

        return new TeacherResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> GetTeacherToUpdate(int id)
    {
      try
      {
        var findTeacher = @"SELECT t.teacherId, t.accountId, 
			                            s.schoolId, t.fullname, 
                                  t.dateOfBirth, t.gender, 
                                  t.address, t.status,
                                  t.dateCreate, t.dateUpdate, t.photoPath
                            FROM TEACHER t
                            LEFT JOIN SCHOOL s
                            ON t.schoolId = s.schoolId
                            WHERE t.teacherId = @id";

        var teacher = await _context.Teachers
          .FromSqlRaw(findTeacher, new SqlParameter("@id", id))
          .Select(static x => new Teacher
          {
            TeacherId = x.TeacherId,
            AccountId = x.AccountId,
            SchoolId = x.SchoolId,
            Fullname = x.Fullname,
            DateOfBirth = x.DateOfBirth,
            Gender = x.Gender,
            Address = x.Address,
            Status = x.Status,
            DateCreate = x.DateCreate,
            DateUpdate = x.DateUpdate,
            PhotoPath = x.PhotoPath,
          })
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (teacher is null)
        {
          return new TeacherResType(404, "Không tìm thấy giáo viên");
        }

        var result = new TeacherToUpdate
        {
          TeacherId = id,
          AccountId = teacher.AccountId,
          Fullname = teacher.Fullname,
          DateOfBirth = teacher.DateOfBirth,
          Gender = teacher.Gender,
          Address = teacher.Address,
          Status = teacher.Status,
          SchoolId = teacher.SchoolId,
          DateCreate = teacher.DateCreate,
          DateUpdate = teacher.DateUpdate,
          PhotoPath = teacher.PhotoPath,
        };

        return new TeacherResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> GetTeacherIdByAccountId(int accountId)
    {
      try
      {
        var findTeacher = @"SELECT t.teacherId, t.accountId, 
			                            s.schoolId, t.fullname, 
                                  t.dateOfBirth, t.gender, 
                                  t.address, t.status,
                                  t.dateCreate, t.dateUpdate, t.photoPath
                            FROM TEACHER t
                            LEFT JOIN SCHOOL s
                            ON t.schoolId = s.schoolId
                            WHERE t.accountId = @accountId";

        var teacher = await _context.Teachers
          .FromSqlRaw(findTeacher, new SqlParameter("@accountId", accountId))
          .Select(static x => new Teacher
          {
            TeacherId = x.TeacherId,
            AccountId = x.AccountId,
            SchoolId = x.SchoolId,
            Fullname = x.Fullname,
            DateOfBirth = x.DateOfBirth,
            Gender = x.Gender,
            Address = x.Address,
            Status = x.Status,
            DateCreate = x.DateCreate,
            DateUpdate = x.DateUpdate,
            PhotoPath = x.PhotoPath,
          })
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (teacher is null)
        {
          return new TeacherResType(404, "Không tìm thấy giáo viên");
        }

        var result = new TeacherToUpdate
        {
          TeacherId = teacher.TeacherId,
          AccountId = teacher.AccountId,
          Fullname = teacher.Fullname,
          DateOfBirth = teacher.DateOfBirth,
          Gender = teacher.Gender,
          Address = teacher.Address,
          Status = teacher.Status,
          SchoolId = teacher.SchoolId,
          DateCreate = teacher.DateCreate,
          DateUpdate = teacher.DateUpdate,
          PhotoPath = teacher.PhotoPath,
        };

        return new TeacherResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<int> GetCountTeachersBySchool(int? id = null)
    {
      try
      {
        var query = _context.Teachers.AsQueryable();
        if (id.HasValue && id > 0)
        {
          query = query.Where(x => x.SchoolId == id.Value);
        }
        return await query.CountAsync();
      }
      catch (Exception ex)
      {
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> GetTeachers(QueryObject? queryObject)
    {
      try
      {
        queryObject ??= new QueryObject();

        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

        var query = @"SELECT * FROM Teacher
                      ORDER BY TEACHERID
                      OFFSET @skip ROWS
                      FETCH NEXT @pageSize ROWS ONLY";

        var teachers = await _context.Teachers
          .FromSqlRaw(query,
          new SqlParameter("@skip", skip),
          new SqlParameter("@pageSize", queryObject.PageSize)
          )
          .Include("School")
          .AsNoTracking()
          .ToListAsync() ?? throw new Exception("Empty");

        var result = teachers.Select(x => new TeacherDetail
        {
          TeacherId = x.TeacherId,
          AccountId = x.AccountId,
          SchoolId = x.SchoolId,
          NameSchool = x.School.NameSchool,
          Fullname = x.Fullname,
          DateOfBirth = x.DateOfBirth.ToString("dd/MM/yyyy"),
          Gender = x.Gender ? "Nam" : "Nữ",
          Address = x.Address,
          Status = x.Status,
          DateCreate = x.DateCreate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          DateUpdate = x.DateUpdate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          SchoolType = x.School.SchoolType,
          PhotoPath = x.PhotoPath
        }).ToList();

        return new TeacherResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> GetTeachersBySchool(QueryObject? queryObject, int schoolId)
    {
      queryObject ??= new QueryObject();
      var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
      try
      {
        if (schoolId == 0) return new TeacherResType(400, "Vui lòng nhập mã trường học");

        var query = @"SELECT * FROM Teacher
                      WHERE schoolId = @schoolId
                      ORDER BY TEACHERID
                      OFFSET @skip ROWS
                      FETCH NEXT @pageSize ROWS ONLY";

        var teachers = await _context.Teachers
          .FromSqlRaw(query,
          new SqlParameter("@schoolId", schoolId),
          new SqlParameter("@skip", skip),
          new SqlParameter("@pageSize", queryObject.PageSize)
          )
          .Include(x => x.School)
          .AsNoTracking()
          .ToListAsync() ?? throw new Exception("Empty");

        if (teachers.Count == 0)
          return new TeacherResType(200, $"Trường học này chưa có giáo viên");

        var result = teachers.Select(x => new TeacherDetail
        {
          TeacherId = x.TeacherId,
          AccountId = x.AccountId,
          SchoolId = x.SchoolId,
          NameSchool = x.School.NameSchool,
          Fullname = x.Fullname,
          DateOfBirth = x.DateOfBirth.ToString("dd/MM/yyyy") ?? string.Empty,
          Gender = x.Gender ? "Nam" : "Nữ",
          Address = x.Address,
          Status = x.Status,
          DateCreate = x.DateCreate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          DateUpdate = x.DateUpdate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          SchoolType = x.School.SchoolType,
          PhotoPath = x.PhotoPath
        }).ToList();

        return new TeacherResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> GetTeachersBySchool(int? schoolId)
    {
      try
      {
        var query = @"SELECT * FROM Teacher
                  WHERE @schoolId IS NULL OR schoolId = @schoolId";

        var schoolIdParam = schoolId.HasValue
          ? new SqlParameter("@schoolId", schoolId)
          : new SqlParameter("@schoolId", DBNull.Value);

        var teachers = await _context.Teachers
          .FromSqlRaw(query, schoolIdParam)
          .Include(x => x.School)
          .ToListAsync() ?? throw new Exception("Empty");

        if (teachers is null || teachers.Count == 0)
        {
          return new TeacherResType(404, $"Trường học này chưa có giáo viên");
        }

        var result = teachers.Select(x => new TeacherDetail
        {
          TeacherId = x.TeacherId,
          AccountId = x.AccountId,
          SchoolId = x.SchoolId,
          NameSchool = x.School.NameSchool,
          Fullname = x.Fullname,
          DateOfBirth = x.DateOfBirth.ToString("dd/MM/yyyy") ?? string.Empty,
          Gender = x.Gender ? "Nam" : "Nữ",
          Address = x.Address,
          Status = x.Status,
          DateCreate = x.DateCreate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          DateUpdate = x.DateUpdate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          SchoolType = x.School.SchoolType,
          PhotoPath = x.PhotoPath,
        }).ToList();

        return new TeacherResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> CreateTeacher(TeacherDto model)
    {
      try
      {
        var photoUploadResult = model.PhotoPath != null
            ? await _photo.CreatePhotoAsync(model.PhotoPath)
            : null;

        var findTeacher = "SELECT * FROM Teacher WHERE teacherId = @id";

        var teacher = await _context.Teachers
          .FromSqlRaw(findTeacher, new SqlParameter("@id", model.TeacherId))
          .FirstOrDefaultAsync();

        if (teacher is not null)
        {
          return new TeacherResType(409, "Teacher already exists");
        }

        var sqlInsert = @"INSERT INTO Teacher (AccountId, SchoolId, Fullname, DateOfBirth, Gender, Address, Status, DateCreate, DateUpdate, PhotoPath) 
                          VALUES (@AccountId, @SchoolId, @Fullname, @DateOfBirth, @Gender, @Address, @Status, @DateCreate, @DateUpdate, @PhotoPath);
                          SELECT CAST(SCOPE_IDENTITY() as int);";

        var currentdate = DateTime.UtcNow;
        var imgUrl = photoUploadResult?.SecureUrl.ToString();

        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@AccountId", model.AccountId),
          new SqlParameter("@SchoolId", model.SchoolId),
          new SqlParameter("@Fullname", model.Fullname),
          new SqlParameter("@DateOfBirth", model.DateOfBirth),
          new SqlParameter("@Gender", model.Gender),
          new SqlParameter("@Address", model.Address),
          new SqlParameter("@Status", model.Status),
          new SqlParameter("@DateCreate", currentdate),
          new SqlParameter("@DateUpdate", DBNull.Value),
          new SqlParameter("@PhotoPath", imgUrl ?? "")
        );

        return new TeacherResType(200, "Tạo mới thành công");
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> UpdateTeacher(int id, TeacherDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        // Check if the teacher exists in the database
        var findQuery = "SELECT * FROM Teacher WHERE TeacherId = @id";
        var existingTeacher = await _context.Teachers
            .FromSqlRaw(findQuery, new SqlParameter("@id", id))
            .FirstOrDefaultAsync();

        if (existingTeacher is null)
        {
          return new TeacherResType(404, "Không tìm thấ y giáo viên");
        }

        var photoUploadResult = model.PhotoPath != null
                   ? await _photo.CreatePhotoAsync(model.PhotoPath)
                   : null;
        var imgUrl = photoUploadResult?.SecureUrl.ToString();

        bool hasChanges = false;

        // Build update query dynamically based on non-null fields
        var parameters = new List<SqlParameter>();
        var queryBuilder = new StringBuilder("UPDATE Teacher SET ");

        if (!string.IsNullOrEmpty(model.Fullname) && model.Fullname != existingTeacher.Fullname)
        {
          queryBuilder.Append("Fullname = @Fullname, ");
          parameters.Add(new SqlParameter("@Fullname", model.Fullname));
          hasChanges = true;
        }

        if (model.AccountId != 0 && model.AccountId != existingTeacher.AccountId)
        {
          queryBuilder.Append("AccountId = @AccountId, ");
          parameters.Add(new SqlParameter("@AccountId", model.AccountId));
          hasChanges = true;
        }

        if (model.SchoolId != 0 && model.SchoolId != existingTeacher.SchoolId)
        {
          queryBuilder.Append("SchoolId = @SchoolId, ");
          parameters.Add(new SqlParameter("@SchoolId", model.SchoolId));
          hasChanges = true;
        }

        if (model.DateOfBirth != default && model.DateOfBirth != existingTeacher.DateOfBirth)
        {
          queryBuilder.Append("DateOfBirth = @DateOfBirth, ");
          parameters.Add(new SqlParameter("@DateOfBirth", model.DateOfBirth));
          hasChanges = true;
        }

        if (model.Gender != default && model.Gender != existingTeacher.Gender)
        {
          queryBuilder.Append("Gender = @Gender, ");
          parameters.Add(new SqlParameter("@Gender", model.Gender));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.Address) && model.Address != existingTeacher.Address)
        {
          queryBuilder.Append("Address = @Address, ");
          parameters.Add(new SqlParameter("@Address", model.Address));
          hasChanges = true;
        }

        if (model.Status != existingTeacher.Status)
        {
          queryBuilder.Append("Status = @Status, ");
          parameters.Add(new SqlParameter("@Status", model.Status));
          hasChanges = true;
        }

        if (model.DateCreate.HasValue)
        {
          queryBuilder.Append("DateCreate = @DateCreate, ");
          parameters.Add(new SqlParameter("@DateCreate", model.DateCreate.Value));
        }

        queryBuilder.Append("DateUpdate = @DateUpdate, ");
        parameters.Add(new SqlParameter("@DateUpdate", DateTime.UtcNow));

        queryBuilder.Append("PhotoPath = @PhotoPath, ");
        parameters.Add(new SqlParameter("@PhotoPath", imgUrl ?? ""));

        if (hasChanges)
        {
          // Xoa dau phay o cuoi cau lenh
          if (queryBuilder[^2] == ',')
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE TeacherId = @id");
          parameters.Add(new SqlParameter("@id", id));

          // Execute the update query
          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          // Commit the transaction
          await transaction.CommitAsync();
          return new TeacherResType(200, "Cập nhật thành công");
        }
        else
        {
          return new TeacherResType(200, "Không phát hiện thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();

        return new TeacherResType(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> ImportExcelFile(IFormFile file)
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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null
                  && reader.GetValue(4) == null && reader.GetValue(5) == null && reader.GetValue(6) == null && reader.GetValue(7) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var myTeachers = new Models.Teacher
                {
                  AccountId = Convert.ToInt16(reader.GetValue(1)),
                  SchoolId = Convert.ToInt16(reader.GetValue(2)),
                  Fullname = reader.GetValue(3).ToString()?.Trim() ?? "Fullname",
                  DateOfBirth = Convert.ToDateTime(reader.GetValue(4)),
                  Gender = Convert.ToBoolean(reader.GetValue(5)),
                  Address = reader.GetValue(6).ToString()?.Trim() ?? "address",
                  Status = Convert.ToBoolean(reader.GetValue(7)),
                  DateCreate = DateTime.UtcNow,
                  DateUpdate = null,
                  PhotoPath = reader.GetValue(8).ToString(),
                };

                await _context.Teachers.AddAsync(myTeachers);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new TeacherResType(200, "Tải danh sách thành công");
        }
        return new TeacherResType(400, "Không có danh sách nào được tải lên");

      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> DeleteTeacher(int id)
    {
      try
      {
        var findTeacher = "SELECT * FROM Teacher WHERE TeacherId = @id";
        var teacher = await _context.Teachers
          .FromSqlRaw(findTeacher, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (teacher is null)
        {
          return new TeacherResType(404, "Không tìm thấy giáo viên");
        }

        var deleteQuery = "DELETE FROM Teacher WHERE TeacherId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));
        return new TeacherResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
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
          return new ResponseData<string>(400, "Vui lòng cung cấp id");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM Teacher WHERE TeacherId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ResponseData<string>(404, "Không tìm thấy giáo viên");
        }

        await transaction.CommitAsync();

        return new ResponseData<string>(200, "Đã xóa");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<string>(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<TeacherResType> SearchTeacher(QueryObjects? queryObject)
    {
      try
      {
        queryObject ??= new QueryObjects();

        var query = _context.Teachers
          .Include(x => x.School)
          .Include(x => x.Account)
          .AsNoTracking()
          .AsQueryable();

        if (queryObject.SchoolId.HasValue)
        {
          query = query.Where(x => x.SchoolId == queryObject.SchoolId.Value);
        }

        if (queryObject.RoleId.HasValue)
        {
          query = query.Where(x => x.Account.RoleId == queryObject.RoleId.Value);
        }

        if (!string.IsNullOrEmpty(queryObject.Name))
        {
          var searchTerm = queryObject.Name.ToLower();
          query = query.Where(x =>
              EF.Functions.Like(x.Fullname.ToLower(), $"%{searchTerm}%"));
        }

        var rawResults = await query.Select(x => new
        {
          x.TeacherId,
          x.AccountId,
          x.SchoolId,
          x.School.NameSchool,
          x.Fullname,
          x.DateOfBirth,
          x.Gender,
          x.Address,
          x.Status,
          x.DateCreate,
          x.DateUpdate
        }).ToListAsync();

        var results = rawResults.Select(x => new TeacherDetail
        {
          TeacherId = x.TeacherId,
          AccountId = x.AccountId,
          SchoolId = x.SchoolId,
          NameSchool = x.NameSchool,
          Fullname = x.Fullname,
          DateOfBirth = x.DateOfBirth.ToString("dd/MM/yyyy") ?? string.Empty,
          Gender = x.Gender ? "Nam" : "Nữ",
          Address = x.Address,
          Status = x.Status,
          DateCreate = x.DateCreate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
          DateUpdate = x.DateUpdate?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty
        }).ToList();

        if (results.Count == 0)
        {
          return new TeacherResType(404, "Không có kết quả");
        }

        return new TeacherResType(200, "Thành công", results);
      }
      catch (Exception ex)
      {
        return new TeacherResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }
  }
}
