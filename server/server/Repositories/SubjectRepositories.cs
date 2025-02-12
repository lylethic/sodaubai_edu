using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using System.Text;


namespace server.Repositories
{
  public class SubjectRepositories : ISubject
  {
    readonly SoDauBaiContext _context;

    public SubjectRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<SubjectDto>> CreateSubject(SubjectDto model)
    {
      if (model is null)
        return new ResponseData<SubjectDto>(400, "Vui lòng cung cấp thông tin môn học hợp lệ");

      try
      {
        var find = "SELECT * FROM Subject WHERE subjectId = @id";

        var subject = await _context.Subjects
          .FromSqlRaw(find, new SqlParameter("@id", model.SubjectId))
          .FirstOrDefaultAsync();

        if (subject is not null)
        {
          return new ResponseData<SubjectDto>(409, "Môn học này đã tồn tại");
        }

        var sqlInsert = @"INSERT INTO SUBJECT (gradeId, subjectName, status)
                     VALUES (@gradeId, @subjectName, @status);
                     SELECT CAST(SCOPE_IDENTITY() as int);";

        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@gradeId", model.GradeId),
          new SqlParameter("@subjectName", model.SubjectName),
          new SqlParameter("@status", model.Status)
          );

        var result = new SubjectDto
        {
          SubjectId = insert,
          GradeId = model.GradeId,
          SubjectName = model.SubjectName,
          Status = model.Status,
        };

        return new ResponseData<SubjectDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<SubjectRes>> GetSubject(int id)
    {
      if (id == 0)
      {
        return new ResponseData<SubjectRes>(400, "Vui lòng cung cấp mã môn học hợp lệ");
      }
      try
      {
        var querySubject = from sub in _context.Subjects
                           join grade in _context.Grades on sub.GradeId equals grade.GradeId into gradeGroup
                           from grade in gradeGroup.DefaultIfEmpty()
                           join acad in _context.AcademicYears on grade.AcademicYearId equals acad.AcademicYearId into acadGroup
                           from acad in acadGroup.DefaultIfEmpty()
                           where sub.SubjectId == id
                           select new SubjectRes
                           {
                             SubjectId = id,
                             SubjectName = sub.SubjectName,
                             Status = sub.Status,
                             GradeId = grade.GradeId,
                             GradeName = grade.GradeName,
                             DisplayAcademicYear_Name = acad.DisplayAcademicYearName,
                             YearStart = acad.YearStart.HasValue ? acad.YearStart.Value.ToString("dd/MM/yyyy") : "",
                             YearEnd = acad.YearEnd.HasValue ? acad.YearEnd.Value.ToString("dd/MM/yyyy") : ""
                           };

        var result = await querySubject.AsNoTracking().FirstOrDefaultAsync();

        if (result is null)
        {
          return new ResponseData<SubjectRes>(404, "Môn học không tồn tại");
        }

        return new ResponseData<SubjectRes>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectRes>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<SubjectRes>>> GetSubjects()
    {
      try
      {
        var querySubject = from sub in _context.Subjects
                           join grade in _context.Grades on sub.GradeId equals grade.GradeId into gradeGroup
                           from grade in gradeGroup.DefaultIfEmpty()
                           join acad in _context.AcademicYears on grade.AcademicYearId equals acad.AcademicYearId into acadGroup
                           from acad in acadGroup.DefaultIfEmpty()
                           select new SubjectRes
                           {
                             SubjectId = sub.SubjectId,
                             SubjectName = sub.SubjectName,
                             Status = sub.Status,
                             GradeId = grade.GradeId,
                             GradeName = grade.GradeName,
                             DisplayAcademicYear_Name = acad.DisplayAcademicYearName,
                             YearStart = acad.YearStart.HasValue ? acad.YearStart.Value.ToString("dd/MM/yyyy") : "",
                             YearEnd = acad.YearEnd.HasValue ? acad.YearEnd.Value.ToString("dd/MM/yyyy") : ""
                           };

        var result = await querySubject
          .AsNoTracking()
          .OrderBy(x => x.GradeId)
          .ThenBy(x => x.GradeName)
          .ToListAsync();

        if (result is null || result.Count == 0)
        {
          return new ResponseData<List<SubjectRes>>(400, "Không có dữ liệu");
        }

        return new ResponseData<List<SubjectRes>>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<SubjectRes>>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<SubjectDto>> UpdateSubject(int id, SubjectDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var find = "SELECT * FROM Subject WHERE subjectId = @id";

        var subject = await _context.Subjects
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (subject is null)
          return new ResponseData<SubjectDto>(404, "Không tìm thấy môn học");


        bool hasChanges = false;

        var queryBuilder = new StringBuilder("UPDATE Subject SET ");
        var parameters = new List<SqlParameter>();

        if (model.GradeId != 0 && model.GradeId != subject.GradeId)
        {
          queryBuilder.Append("GradeId = @GradeId, ");
          parameters.Add(new SqlParameter("@GradeId", model.GradeId));
          hasChanges = true;
        }
        if (!string.IsNullOrEmpty(model.SubjectName) && model.SubjectName != subject.SubjectName)
        {
          queryBuilder.Append("SubjectName = @SubjectName, ");
          parameters.Add(new SqlParameter("@SubjectName", model.SubjectName));
          hasChanges = true;
        }

        if (model.Status != subject.Status)
        {
          queryBuilder.Append("Status = @Status, ");
          parameters.Add(new SqlParameter("@Status", model.Status));
          hasChanges = true;
        }

        if (hasChanges)
        {
          if (queryBuilder[queryBuilder.Length - 2] == ',')
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE subjectId = @id");
          parameters.Add(new SqlParameter("@id", id));

          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, parameters.ToArray());
          await transaction.CommitAsync();
          return new ResponseData<SubjectDto>(200, "Đã cập nhật");
        }
        else
        {
          return new ResponseData<SubjectDto>(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<SubjectDto>> DeleteSubject(int id)
    {
      if (id == 0)
        return new ResponseData<SubjectDto>(400, "Vui lòng cung cấp mã môn học");

      try
      {
        var find = "SELECT * FROM Subject WHERE subjectId = @id";

        var subject = await _context.Subjects
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (subject is null)
        {
          return new ResponseData<SubjectDto>(404, "Môn học không tồn tại");
        }

        var deleteQuery = "DELETE FROM SUBJECT WHERE subjectId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));

        return new ResponseData<SubjectDto>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectDto>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
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
          return new ResponseData<string>(400, "Không có mã môn học nào được cung cấp");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM Subject WHERE SubjectId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ResponseData<string>(404, "Môn học không tồn tại");
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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null
                && reader.GetValue(3) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var gradeId = Convert.ToInt16(reader.GetValue(1));
                var gradeExists = await _context.Grades.AnyAsync(g => g.GradeId == gradeId);

                if (!gradeExists)
                  return new ResponseData<string>(404, $"Mã khối học {gradeId} không tồn tại");

                var mySubjects = new Models.Subject
                {
                  GradeId = gradeId,
                  SubjectName = reader.GetValue(2).ToString() ?? "null",
                  Status = Convert.ToBoolean(reader.GetValue(3))
                };
                await _context.Subjects.AddAsync(mySubjects);
              }
              await _context.SaveChangesAsync();
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(200, "Không có tệp nào được tải lên");
      }
      catch (Exception ex)
      {
        return new ResponseData<string>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }
  }
}
