using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using System.Text;


namespace server.Repositories
{
  public class StudentRepositories : IStudent
  {
    private readonly Data.SoDauBaiContext _context;

    public StudentRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<StudentDto>> CreateStudent(StudentDto model)
    {
      try
      {
        var find = "SELECT * FROM STUDENT WHERE StudentId = @id";

        var student = await _context.Students
          .FromSqlRaw(find, new SqlParameter("@id", model.StudentId))
          .FirstOrDefaultAsync();

        if (student is not null)
        {
          return new ResponseData<StudentDto>(409, "Student already exists");
        }

        var sqlInsert = @"INSERT INTO STUDENT (ClassId, GradeId, AccountId, Fullname, Status, Description, DateCreated, DateUpdated, Address, DateOfBirth) 
                          VALUES (@ClassId, @GradeId, @AccountId, @Fullname, @Status, @Description, @DateCreated, @DateUpdated, @Address, @DateOfBirth);
                          SELECT CAST(SCOPE_IDENTITY() as int);";

        var currentdate = DateTime.UtcNow;

        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@ClassId", model.ClassId),
          new SqlParameter("@GradeId", model.GradeId),
          new SqlParameter("@AccountId", model.AccountId),
          new SqlParameter("@Fullname", model.Fullname),
          new SqlParameter("@DateOfBirth", model.DateOfBirth),
          new SqlParameter("@Address", model.Address),
          new SqlParameter("@Status", model.Status),
          new SqlParameter("@Description", model.Description),
          new SqlParameter("@DateCreated", currentdate),
          new SqlParameter("@DateUpdated", DBNull.Value)
        );

        var result = new StudentDto
        {
          StudentId = insert,
          ClassId = model.ClassId,
          GradeId = model.GradeId,
          AccountId = model.AccountId,
          Fullname = model.Fullname,
          DateOfBirth = model.DateOfBirth,
          Address = model.Address,
          Status = model.Status,
          Description = model.Description,
          DateCreated = model.DateCreated,
          DateUpdated = model.DateUpdated
        };

        return new ResponseData<StudentDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<StudentDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<StudentDetail>> GetStudent(int id)
    {
      try
      {
        // Correct SQL query with proper aliases
        var query = @"
            SELECT s.StudentId, s.ClassId, s.GradeId, s.AccountId, s.Fullname, s.Status, s.Description, s.dateCreated, s.dateUpdated, a.SchoolId, a.Email, s.DateOfBirth, s.Address
            FROM Student s INNER JOIN Account a ON s.AccountId = a.AccountId
            WHERE s.StudentId = @id";

        // Fetch the data using FromSqlRaw
        var student = await _context.Students
            .FromSqlRaw(query, new SqlParameter("@id", id))
            .Include(x => x.Class)
            .Select(static s => new
            {
              s.StudentId,
              s.ClassId,
              s.GradeId,
              s.Account.AccountId,
              s.Fullname,
              s.Description,
              s.Status,
              s.DateCreated,
              s.DateUpdated,
              s.Account.SchoolId,
              s.Account.School.NameSchool,
              s.Account.Email,
              s.Class.ClassName,
              s.Address,
              s.DateOfBirth
            })
            .AsNoTracking()
            .FirstOrDefaultAsync();

        if (student is null)
        {
          return new ResponseData<StudentDetail>(404, "Học sinh không tồn tại");
        }

        // Map the result to the StudentDto
        var result = new StudentDetail
        {
          StudentId = id,
          ClassId = student.ClassId,
          GradeId = student.GradeId,
          AccountId = student.AccountId,
          Fullname = student.Fullname,
          Description = student.Description,
          Status = student.Status,
          DateCreated = student.DateCreated,
          DateUpdated = student.DateUpdated,
          SchoolId = student.SchoolId,
          SchoolName = student.NameSchool,
          Email = student.Email,
          ClassName = student.ClassName,
          Address = student.Address,
          DateOfBirth = student.DateOfBirth,
        };

        return new ResponseData<StudentDetail>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<StudentDetail>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<StudentDetail>>> GetStudents(int? schoolId)
    {
      try
      {
        if (schoolId == 0) return new ResponseData<List<StudentDetail>>(400, "Vui lòng nhập mã trường học");

        var queryStudentBySchool = from student in _context.Students
                                   join account in _context.Accounts on student.AccountId equals account.AccountId into accountGroup
                                   from account in accountGroup.DefaultIfEmpty()
                                   where account.SchoolId == schoolId || schoolId == null
                                   select new StudentDetail
                                   {
                                     StudentId = student.StudentId,
                                     ClassId = student.ClassId,
                                     GradeId = student.GradeId,
                                     AccountId = student.AccountId,
                                     Fullname = student.Fullname,
                                     Status = student.Status,
                                     Description = student.Description,
                                     DateCreated = student.DateCreated,
                                     DateUpdated = student.DateUpdated,
                                     Email = account.Email,
                                     SchoolId = account.SchoolId,
                                     SchoolName = account.School.NameSchool,
                                     ClassName = student.Class.ClassName,
                                     Address = student.Address,
                                     DateOfBirth = student.DateOfBirth,
                                   };

        var students = await queryStudentBySchool
          .AsNoTracking()
          .OrderBy(x => x.Fullname)
          .ToListAsync();

        if (students is null || students.Count == 0)
          return new ResponseData<List<StudentDetail>>(404, "Không có kết quả");

        return new ResponseData<List<StudentDetail>>(200, "Thành công", students);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<StudentDetail>>(500, $"Error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<StudentDetail>>> GetStudents(int schoolId, int classId)
    {
      try
      {
        if (schoolId == 0) return new ResponseData<List<StudentDetail>>(400, "Vui lòng nhập mã trường học");

        var queryStudentBySchool = from student in _context.Students
                                   join account in _context.Accounts on student.AccountId equals account.AccountId into accountGroup
                                   from account in accountGroup.DefaultIfEmpty()
                                   where account.SchoolId == schoolId && student.ClassId == classId
                                   select new StudentDetail
                                   {
                                     StudentId = student.StudentId,
                                     ClassId = student.ClassId,
                                     GradeId = student.GradeId,
                                     AccountId = student.AccountId,
                                     Fullname = student.Fullname,
                                     Status = student.Status,
                                     Description = student.Description,
                                     DateCreated = student.DateCreated,
                                     DateUpdated = student.DateUpdated,
                                     Email = account.Email,
                                     SchoolId = account.SchoolId,
                                     SchoolName = account.School.NameSchool,
                                     ClassName = student.Class.ClassName,
                                     Address = student.Address,
                                     DateOfBirth = student.DateOfBirth,
                                   };

        var students = await queryStudentBySchool
          .AsNoTracking()
          .OrderBy(x => x.Fullname)
          .ToListAsync();

        if (students is null || students.Count == 0)
          return new ResponseData<List<StudentDetail>>(404, "Không có kết quả");

        return new ResponseData<List<StudentDetail>>(200, "Thành công", students);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<StudentDetail>>(500, $"Error: {ex.Message}");
      }
    }

    public async Task<ResponseData<StudentDto>> UpdateStudent(int id, StudentDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var find = "SELECT * FROM Student WHERE StudentId = @id";
        var exists = await _context.Students
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (exists is null)
        {
          return new ResponseData<StudentDto>(404, "Học sinh này không tồn tại");
        }

        bool hasChanges = false;

        var parameters = new List<SqlParameter>();
        var queryBuilder = new StringBuilder("UPDATE Student SET ");

        if (model.ClassId != 0 && model.ClassId != exists.ClassId)
        {
          queryBuilder.Append("ClassId = @ClassId, ");
          parameters.Add(new SqlParameter("@ClassId", model.ClassId));
          hasChanges = true;
        }

        if (model.GradeId != 0 && model.GradeId != exists.GradeId)
        {
          queryBuilder.Append("GradeId = @GradeId, ");
          parameters.Add(new SqlParameter("@GradeId", model.GradeId));
          hasChanges = true;
        }

        if (model.AccountId != 0 && model.AccountId != exists.AccountId)
        {
          queryBuilder.Append("accountId = @accountId, ");
          parameters.Add(new SqlParameter("@accountId", model.AccountId));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.Fullname) && model.Fullname != exists.Fullname)
        {
          queryBuilder.Append("Fullname = @Fullname, ");
          parameters.Add(new SqlParameter("@Fullname", model.Fullname));
          hasChanges = true;
        }

        if (model.DateOfBirth != exists.DateOfBirth)
        {
          queryBuilder.Append("DateOfBirth = @DateOfBirth, ");
          parameters.Add(new SqlParameter("@DateOfBirth", model.DateOfBirth));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.Address) && model.Address != exists.Address)
        {
          queryBuilder.Append("Address = @Address, ");
          parameters.Add(new SqlParameter("@Address", model.Address));
          hasChanges = true;
        }

        if (model.Status != exists.Status && model.Status != exists.Status)
        {
          queryBuilder.Append("Status = @Status, ");
          parameters.Add(new SqlParameter("@Status", model.Status));
          hasChanges = true;
        }

        if (model.Description != exists.Description && model.Description != exists.Description)
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

        if (model.DateUpdated != exists.DateUpdated)
        {
          queryBuilder.Append("DateUpdated = @DateUpdated, ");
          parameters.Add(new SqlParameter("@DateUpdated", model.DateUpdated));
          hasChanges = true;
        }

        if (hasChanges)
        {
          if (queryBuilder.Length > 0)
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE StudentId = @id");
          parameters.Add(new SqlParameter("@id", id));

          var updateQuery = queryBuilder.ToString();
          await transaction.CommitAsync();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          return new ResponseData<StudentDto>(200, "Cập nhật thành công");
        }
        else
        {
          return new ResponseData<StudentDto>(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<StudentDto>(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> ImportExcel(IFormFile file)
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
                  && reader.GetValue(4) == null && reader.GetValue(5) == null && reader.GetValue(8) == null
                  && reader.GetValue(9) == null && reader.GetValue(10) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var myStudent = new Models.Student
                {
                  ClassId = Convert.ToInt32(reader.GetValue(1)),
                  GradeId = Convert.ToInt32(reader.GetValue(2)),
                  AccountId = Convert.ToInt32(reader.GetValue(3)),
                  Fullname = reader.GetValue(4).ToString() ?? "Undefined",
                  Status = Convert.ToBoolean(reader.GetValue(5)),
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null,
                  Description = reader.GetValue(8)?.ToString() ?? $"{DateTime.UtcNow}",
                  DateOfBirth = Convert.ToDateTime(reader.GetValue(9)),
                  Address = reader.GetValue(10).ToString() ?? ""
                };

                await _context.Students.AddAsync(myStudent);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(200, "Không có tệp nào được tải lên");

      }
      catch (Exception ex)
      {
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<ResponseData<StudentDto>> DeleteStudent(int id)
    {
      try
      {
        var find = "SELECT * FROM STUDENT WHERE StudentId = @id";
        var student = await _context.Students
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (student is null)
        {
          return new ResponseData<StudentDto>(404, "Không tìm thấy học sinh");
        }

        var deleteQuery = "DELETE FROM Student WHERE StudentId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));
        return new ResponseData<StudentDto>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<StudentDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ResponseData<string>(400, "Vui lòng cung cấp mã học sinh");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM STUDENT WHERE StudentId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ResponseData<string>(404, "Học sinh không tồn tại");
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
