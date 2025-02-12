using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using System.Text;

namespace server.Repositories
{
  public class SubjectAssgmRepositories : ISubject_Assgm
  {
    readonly SoDauBaiContext _context;

    public SubjectAssgmRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<SubjectAssgmDto>> CreateSubjectAssgm(SubjectAssgmDto model)
    {
      try
      {
        // check teacher
        var findTeacher = @"SELECT * FROM TEACHER WHERE TeacherId = @id";
        var teacherExists = await _context.Teachers
          .FromSqlRaw(findTeacher, new SqlParameter("@id", model.TeacherId))
          .FirstOrDefaultAsync();

        if (teacherExists is null)
        {
          return new ResponseData<SubjectAssgmDto>(404, "Mã giáo viên không tồn tại");
        }

        // check subject
        var findSubject = "SELECT * FROM Subject WHERE SubjectId = @id";
        var subjectExists = await _context.Subjects
         .FromSqlRaw(findSubject, new SqlParameter("@id", model.SubjectId))
         .FirstOrDefaultAsync();

        if (subjectExists is null)
        {
          return new ResponseData<SubjectAssgmDto>(404, "Mã môn học không tồn tại");
        }

        //check subject assignment
        var find = "SELECT * FROM SubjectAssignment WHERE subjectAssignmentId = @id";
        var subjectAssgmt = await _context.SubjectAssignments
          .FromSqlRaw(find, new SqlParameter("@id", model.SubjectAssignmentId))
          .FirstOrDefaultAsync();

        if (subjectAssgmt is not null)
        {
          return new ResponseData<SubjectAssgmDto>(409, "Môn học này đã được đăng ký");
        }

        var sqlInsert = @"INSERT INTO SubjectAssignment (teacherId, subjectId, description, dateCreated, dateUpdated)
                          VALUES (@teacherId, @subjectId, @description, @dateCreated, @dateUpdated);
                          SELECT CAST(SCOPE_IDENTITY() as int);";

        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@teacherId", model.TeacherId),
          new SqlParameter("@subjectId", model.SubjectId),
          new SqlParameter("@description", model.Description),
          new SqlParameter("@dateCreated", DateTime.UtcNow),
          new SqlParameter("@dateUpdated", DBNull.Value)
          );

        var result = new SubjectAssgmDto
        {
          SubjectAssignmentId = insert,
          TeacherId = model.TeacherId,
          SubjectId = model.SubjectId,
          Description = model.Description,
          DateCreated = model.DateCreated,
          DateUpdated = model.DateUpdated,
        };

        return new ResponseData<SubjectAssgmDto>(200, "Tạo mới thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectAssgmDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<SubjectAssgmDetail>> GetSubjectAssgm(int id)
    {
      try
      {
        var find = @"SELECT SA.subjectAssignmentId, SA.teacherId, T.fullname, SA.subjectId, S.subjectName, SA.dateCreated, SA.dateUpdated
                    FROM SUBJECTASSIGNMENT AS SA 
                    LEFT JOIN Subject AS S ON SA.subjectId = S.subjectId
                    LEFT JOIN Teacher AS T ON T.teacherId = SA.teacherId
                    WHERE SubjectAssignmentId = @id";

        var subjectAssgmt = await _context.SubjectAssignments
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .AsNoTracking()
          .Select(static x => new SubjectAssgmDetail
          {
            SubjectAssignmentId = x.SubjectAssignmentId,
            SubjectId = x.SubjectId,
            TeacherId = x.TeacherId,
            Fullname = x.Teacher.Fullname,
            SubjectName = x.Subject.SubjectName,
            DateCreated = x.DateCreated,
            DateUpdated = x.DateUpdated
          })
          .FirstOrDefaultAsync();

        if (subjectAssgmt is null)
        {
          return new ResponseData<SubjectAssgmDetail>(404, "Nội dung phân công môn học không tồn tại");
        }

        var result = new SubjectAssgmDetail
        {
          SubjectAssignmentId = subjectAssgmt.SubjectAssignmentId,
          SubjectId = subjectAssgmt.SubjectId,
          TeacherId = subjectAssgmt.TeacherId,
          Fullname = subjectAssgmt.Fullname,
          SubjectName = subjectAssgmt.SubjectName,
          DateCreated = subjectAssgmt.DateCreated,
          DateUpdated = subjectAssgmt.DateUpdated
        };

        return new ResponseData<SubjectAssgmDetail>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectAssgmDetail>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<SubjectAssgmDetail>> GetTeacherBySubjectAssgm(int id)
    {
      try
      {
        var find = @"SELECT SA.subjectAssignmentId, SA.teacherId, T.fullname, SA.subjectId, S.subjectName, SA.dateCreated, SA.dateUpdated
                    FROM SUBJECTASSIGNMENT AS SA 
                    LEFT JOIN Subject AS S ON SA.subjectId = S.subjectId
                    LEFT JOIN Teacher AS T ON T.teacherId = SA.teacherId
                    WHERE T.teacherId = @id";

        var subjectAssgmt = await _context.SubjectAssignments
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .AsNoTracking()
          .Select(static x => new SubjectAssgmDetail
          {
            SubjectAssignmentId = x.SubjectAssignmentId,
            SubjectId = x.SubjectId,
            TeacherId = x.TeacherId,
            Fullname = x.Teacher.Fullname,
            SubjectName = x.Subject.SubjectName,
            DateCreated = x.DateCreated,
            DateUpdated = x.DateUpdated
          })
          .FirstOrDefaultAsync();

        if (subjectAssgmt is null)
        {
          return new ResponseData<SubjectAssgmDetail>(404, "Nội dung phân công môn học không tồn tại");
        }

        var result = new SubjectAssgmDetail
        {
          SubjectAssignmentId = subjectAssgmt.SubjectAssignmentId,
          SubjectId = subjectAssgmt.SubjectId,
          TeacherId = subjectAssgmt.TeacherId,
          Fullname = subjectAssgmt.Fullname,
          SubjectName = subjectAssgmt.SubjectName,
          DateCreated = subjectAssgmt.DateCreated,
          DateUpdated = subjectAssgmt.DateUpdated
        };

        return new ResponseData<SubjectAssgmDetail>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectAssgmDetail>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<SubjectAssgmDto>> GetSubjectAssgmToUpdate(int id)
    {
      try
      {
        var find = @"SELECT S.*
                    FROM SUBJECTASSIGNMENT as S
                    WHERE SubjectAssignmentId = @id";

        var subjectAssgmt = await _context.SubjectAssignments
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .AsNoTracking()
          .Select(static x => new SubjectAssgmDetail
          {
            SubjectAssignmentId = x.SubjectAssignmentId,
            SubjectId = x.SubjectId,
            TeacherId = x.TeacherId,
            DateCreated = x.DateCreated,
            DateUpdated = x.DateUpdated
          })
          .FirstOrDefaultAsync();

        if (subjectAssgmt is null)
        {
          return new ResponseData<SubjectAssgmDto>(404, "Nội dung phân công môn học không tồn tại");
        }

        var result = new SubjectAssgmDto
        {
          SubjectAssignmentId = subjectAssgmt.SubjectAssignmentId,
          SubjectId = subjectAssgmt.SubjectId,
          TeacherId = subjectAssgmt.TeacherId,
          DateCreated = subjectAssgmt.DateCreated,
          DateUpdated = subjectAssgmt.DateUpdated
        };

        return new ResponseData<SubjectAssgmDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectAssgmDto>(500, $"Server error: {ex.Message}");
      }

    }

    public async Task<ResponseData<List<SubjectAssgmDetail>>> GetSubjectAssgms()
    {
      try
      {
        var find = @"SELECT SA.subjectAssignmentId, SA.teacherId, T.fullname, SA.subjectId, S.subjectName, SA.dateCreated, SA.dateUpdated, SA.description
                    FROM SUBJECTASSIGNMENT AS SA 
                    LEFT JOIN Subject AS S ON SA.subjectId = S.subjectId
                    LEFT JOIN Teacher AS T ON T.teacherId = SA.teacherId";

        var subjectAssgmt = await _context.SubjectAssignments
          .FromSqlRaw(find)
          .AsNoTracking()
          .Select(static x => new
          {
            x.SubjectAssignmentId,
            x.TeacherId,
            x.Teacher.Fullname,
            x.SubjectId,
            x.Subject.SubjectName,
            x.Description,
            x.DateCreated,
            x.DateUpdated,
          })
          .ToListAsync() ?? throw new Exception("Empty");

        var result = subjectAssgmt.Select(x => new SubjectAssgmDetail
        {
          SubjectAssignmentId = x.SubjectAssignmentId,
          TeacherId = x.TeacherId,
          Fullname = x.Fullname,
          SubjectId = x.SubjectId,
          SubjectName = x.SubjectName,
          Description = x.Description,
          DateCreated = x.DateCreated,
          DateUpdated = x.DateUpdated,
        }).ToList();

        return new ResponseData<List<SubjectAssgmDetail>>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<SubjectAssgmDetail>>(200, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<SubjectAssgmDto>> UpdateSubjectAssgm(int id, SubjectAssgmDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var find = "SELECT * FROM SUBJECTASSIGNMENT WHERE SubjectAssignmentId = @id";

        var subjectAssgmt = await _context.SubjectAssignments
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (subjectAssgmt is null)
        {
          return new ResponseData<SubjectAssgmDto>(404, "Mã phân công không tồn tại");
        }

        var queryBuilder = new StringBuilder("UPDATE SUBJECTASSIGNMENT SET ");
        var parameters = new List<SqlParameter>();
        bool hasChange = false;

        if (model.SubjectId != 0 && model.SubjectId != subjectAssgmt.SubjectId)
        {
          queryBuilder.Append("SubjectId = @SubjectId, ");
          parameters.Add(new SqlParameter("@SubjectId", model.SubjectId));
          hasChange = true;
        }

        if (model.TeacherId != 0 && model.TeacherId != subjectAssgmt.TeacherId)
        {
          queryBuilder.Append("TeacherId = @TeacherId, ");
          parameters.Add(new SqlParameter("@TeacherId", model.TeacherId));
          hasChange = true;
        }

        if (model.Description != null && model.Description != subjectAssgmt.Description)
        {
          queryBuilder.Append("Description = @Description, ");
          parameters.Add(new SqlParameter("@Description", model.Description));
          hasChange = true;
        }

        if (hasChange)
        {
          if (queryBuilder[^2] == ',')
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE SubjectAssignmentId = @id");
          parameters.Add(new SqlParameter("@id", id));

          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          await transaction.CommitAsync();
          return new ResponseData<SubjectAssgmDto>(200, "Cập nhật thành công");
        }
        else
        {
          return new ResponseData<SubjectAssgmDto>(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<SubjectAssgmDto>(500, $"Server error: {ex.Message}");
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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                int teacherId = Convert.ToInt32(reader.GetValue(1));
                int subjectId = Convert.ToInt32(reader.GetValue(2));
                var teacherExisting = await _context.Teachers.AnyAsync(x => x.TeacherId == teacherId);
                var subjectExisting = await _context.Subjects.AnyAsync(x => x.SubjectId == subjectId);
                if (!teacherExisting || !subjectExisting)
                {
                  continue;
                }

                var mySubjects = new Models.SubjectAssignment
                {
                  TeacherId = teacherId,
                  SubjectId = subjectId,
                  Description = reader.GetValue(3).ToString()?.Trim() ?? "_",
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null
                };

                await _context.SubjectAssignments.AddAsync(mySubjects);
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
        if (ex.InnerException != null)
        {
          Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
        }
        throw new Exception($"Error while uploading file: {ex.Message}", ex);
      }
    }

    public async Task<ResponseData<SubjectAssgmDto>> DeleteSubjectAssgm(int id)
    {
      try
      {
        var find = "SELECT * FROM SUBJECTASSIGNMENT WHERE SubjectAssignmentId = @id";
        var subjectAssgmt = await _context.SubjectAssignments
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (subjectAssgmt is null)
        {
          return new ResponseData<SubjectAssgmDto>(404, "Nội dung phân công môn học này không tồn tại");
        }

        var deleteQuery = "DELETE FROM SUBJECTASSIGNMENT WHERE SubjectAssignmentId = @id";
        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));

        return new ResponseData<SubjectAssgmDto>(200, "Đã xóa");
      }
      catch (Exception ex)
      {
        return new ResponseData<SubjectAssgmDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ResponseData<string>(400, "Vui lòng chọn các đối tượng muốn xóa");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM SubjectAssignments WHERE subjectAssignmentId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ResponseData<string>(404, "Đối tượng không tồn tại");
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
