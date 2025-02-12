using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Types.ChuNhiem;
using System.Text;

namespace server.Repositories
{
  public class PCChuNhiemRepositories : IPC_ChuNhiem
  {
    private readonly SoDauBaiContext _context;

    public PCChuNhiemRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ChuNhiemResType> CreatePC_ChuNhiem(PC_ChuNhiemDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (model is null)
        {
          return new ChuNhiemResType(400, "Vui lòng điền đầy đủ thông tin");
        }

        // Check if teacherId exists
        var teacherExists = await _context.Teachers
            .AnyAsync(c => c.TeacherId == model.TeacherId);

        if (!teacherExists)
        {
          return new ChuNhiemResType(404, "Giáo viên không tồn tại");
        }

        // Check if classId exists
        var classExists = await _context.Classes
            .AnyAsync(c => c.ClassId == model.ClassId);

        if (!classExists)
        {
          return new ChuNhiemResType(404, "Lớp học không tồn tại");
        }

        // Check if semesterId exists
        var academicYearExistis = await _context.AcademicYears
            .AnyAsync(s => s.AcademicYearId == model.AcademicYearId);

        if (!academicYearExistis)
        {
          return new ChuNhiemResType(404, "Năm học không tồn tại");
        }

        var queryInsert = @"INSERT INTO PhanCongChuNhiem 
                                        (teacherId, classId, academicYearId, 
                                          status, description, dateCreated, dateUpdated)
                                VALUES 
                                        (@teacherId, @classId, @academicYearId, 
                                          @status, @description, @dateCreated, @dateUpdated);
                                SELECT CAST(SCOPE_IDENTITY() AS INT);";

        var insert = await _context.Database.ExecuteSqlRawAsync(queryInsert,
            new SqlParameter("@teacherId", model.TeacherId),
            new SqlParameter("@classId", model.ClassId),
            new SqlParameter("@academicYearId", model.AcademicYearId),
            new SqlParameter("@status", model.Status),
            new SqlParameter("@description", model.Description),
            new SqlParameter("@dateCreated", DateTime.UtcNow),
            new SqlParameter("@dateUpdated", DBNull.Value)
        );

        await transaction.CommitAsync();

        var data = new PC_ChuNhiemDto
        {
          PhanCongChuNhiemId = insert,
          TeacherId = model.TeacherId,
          ClassId = model.ClassId,
          AcademicYearId = model.AcademicYearId,
          Status = model.Status,
          Description = model.Description
        };

        return new ChuNhiemResType(200, "Tạo mới thành công", data);
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ChuNhiemResType(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<ChuNhiemResType> GetPC_ChuNhiem(int id)
    {
      try
      {
        var chuNhiemQuery = from chuNhiem in _context.PhanCongChuNhiems
                            join teacher in _context.Teachers on chuNhiem.TeacherId equals teacher.TeacherId into teacherGroup
                            from teacher in teacherGroup.DefaultIfEmpty()
                            join classes in _context.Classes on chuNhiem.ClassId equals classes.ClassId into classesGroup
                            from classes in classesGroup.DefaultIfEmpty()
                            join academicYear in _context.AcademicYears on chuNhiem.AcademicYearId equals academicYear.AcademicYearId into academicYearGroup
                            from academicYear in academicYearGroup.DefaultIfEmpty()
                            join school in _context.Schools on classes.SchoolId equals school.SchoolId into schoolGroup
                            from school in schoolGroup.DefaultIfEmpty()
                            select new PhanCongData
                            {
                              PhanCongChuNhiemId = chuNhiem.PhanCongChuNhiemId,
                              SchoolId = school.SchoolId,
                              SchoolName = school.NameSchool,
                              TeacherId = chuNhiem.TeacherId,
                              TeacherName = teacher.Fullname,
                              GradeId = classes.GradeId,
                              ClassId = classes.ClassId,
                              NameClass = classes.ClassName,
                              AcademicYearId = (int)(chuNhiem.AcademicYearId ?? null)!,
                              AcademicYearName = academicYear.DisplayAcademicYearName,
                              Status = chuNhiem.Status,
                              DateCreated = chuNhiem.DateCreated,
                              DateUpdated = chuNhiem.DateUpdated
                            };

        var result = await chuNhiemQuery
        .Where(x => x.PhanCongChuNhiemId == id)
        .FirstOrDefaultAsync();

        if (result is null)
        {
          return new ChuNhiemResType(404, "Không tìm thấy");
        }

        return new ChuNhiemResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ChuNhiemResType(500, $"Server erorr: {ex.Message}");
      }
    }

    public async Task<ChuNhiemResType> GetPC_ChuNhiems()
    {
      try
      {
        var chuNhiemQuery = from chuNhiem in _context.PhanCongChuNhiems
                            join teacher in _context.Teachers on chuNhiem.TeacherId equals teacher.TeacherId into teacherGroup
                            from teacher in teacherGroup.DefaultIfEmpty()
                            join classes in _context.Classes on chuNhiem.ClassId equals classes.ClassId into classesGroup
                            from classes in classesGroup.DefaultIfEmpty()
                            join academicYear in _context.AcademicYears on chuNhiem.AcademicYearId equals academicYear.AcademicYearId into academicYearGroup
                            from academicYear in academicYearGroup.DefaultIfEmpty()
                            join school in _context.Schools on classes.SchoolId equals school.SchoolId into schoolGroup
                            from school in schoolGroup.DefaultIfEmpty()
                            select new PhanCongData
                            {
                              PhanCongChuNhiemId = chuNhiem.PhanCongChuNhiemId,
                              SchoolId = classes.SchoolId,
                              SchoolName = school.NameSchool,
                              GradeId = classes.GradeId,
                              TeacherId = chuNhiem.TeacherId,
                              TeacherName = teacher.Fullname,
                              ClassId = chuNhiem.ClassId,
                              NameClass = classes.ClassName,
                              AcademicYearId = (int)(chuNhiem.AcademicYearId ?? null)!,
                              AcademicYearName = academicYear.DisplayAcademicYearName,
                              Status = chuNhiem.Status,
                              DateCreated = chuNhiem.DateCreated,
                              DateUpdated = chuNhiem.DateUpdated
                            };

        var result = await chuNhiemQuery
        .OrderBy(x => x.PhanCongChuNhiemId)
        .ToListAsync();

        if (result is null || result.Count == 0)
        {
          return new ChuNhiemResType(404, "Không tìm thấy");
        }

        return new ChuNhiemResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ChuNhiemResType(500, $"Server erorr: {ex.Message}");
      }
    }

    public async Task<ChuNhiemResType> Get_ChuNhiem_Teacher_Class(int schoolId, int? gradeId, int? classId)
    {
      try
      {
        if (schoolId == 0)
        {
          return new ChuNhiemResType(400, "Vui lòng cung cấp ít nhất mã trường học", []);
        }

        var chuNhiemQuery = from chuNhiem in _context.PhanCongChuNhiems
                            join teacher in _context.Teachers on chuNhiem.TeacherId equals teacher.TeacherId into teacherGroup
                            from teacher in teacherGroup.DefaultIfEmpty()
                            join classes in _context.Classes on chuNhiem.ClassId equals classes.ClassId into classesGroup
                            from classes in classesGroup.DefaultIfEmpty()
                            join academicYear in _context.AcademicYears on chuNhiem.AcademicYearId equals academicYear.AcademicYearId into academicYearGroup
                            from academicYear in academicYearGroup.DefaultIfEmpty()
                            join school in _context.Schools on classes.SchoolId equals school.SchoolId into schoolGroup
                            from school in schoolGroup.DefaultIfEmpty()
                            where teacher.SchoolId == schoolId
                                    && (gradeId == null || classes.GradeId == gradeId)
                                    && (classId == null || classes.ClassId == classId)
                            select new PhanCongData
                            {
                              PhanCongChuNhiemId = chuNhiem.PhanCongChuNhiemId,
                              SchoolId = classes.SchoolId,
                              SchoolName = school.NameSchool,
                              TeacherId = chuNhiem.TeacherId,
                              TeacherName = teacher.Fullname,
                              GradeId = classes.GradeId,
                              ClassId = classes.ClassId,
                              NameClass = classes.ClassName,
                              AcademicYearId = (int)(chuNhiem.AcademicYearId ?? null)!,
                              AcademicYearName = academicYear.DisplayAcademicYearName,
                              Status = chuNhiem.Status,
                              DateCreated = chuNhiem.DateCreated,
                              DateUpdated = chuNhiem.DateUpdated
                            };

        var result = await chuNhiemQuery.ToListAsync();

        if (result is null || result.Count == 0)
        {
          return new ChuNhiemResType(404, "Không có kết quả", []);
        }

        return new ChuNhiemResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ChuNhiemResType(500, $"Server erorr: {ex.Message}");
      }
    }

    public async Task<ChuNhiemResType> UpdatePC_ChuNhiem(int id, PC_ChuNhiemDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        if (id == 0)
        {
          return new ChuNhiemResType(400, "Vui lòng cung cấp mã phân công");

        }
        var existing = await _context.PhanCongChuNhiems.FindAsync(id);
        if (existing is null)
        {
          return new ChuNhiemResType(404, "Không tìm thấy");
        }

        var hasChange = false;

        if (model.TeacherId != 0 && model.TeacherId != existing.TeacherId)
        {
          existing.TeacherId = model.TeacherId;
          hasChange = true;
        }
        if (model.ClassId != 0 && model.ClassId != existing.ClassId)
        {
          existing.ClassId = model.ClassId;
          hasChange = true;
        }

        if (model.AcademicYearId != 0 && model.AcademicYearId != existing.AcademicYearId)
        {
          existing.AcademicYearId = model.AcademicYearId;
          hasChange = true;
        }
        if (model.Status != existing.Status)
        {
          existing.Status = model.Status;
          hasChange = true;
        }
        if (model.DateCreated.HasValue)
        {
          existing.DateCreated = model.DateCreated.Value;
          hasChange = true;
        }
        if (DateTime.UtcNow != existing.DateUpdated)
        {
          existing.DateUpdated = DateTime.UtcNow;
          hasChange = true;
        }
        if (model.Description != existing.Description)
        {
          existing.Description = model.Description;
          hasChange = true;
        }
        if (hasChange)
        {
          await transaction.CommitAsync();
          await _context.SaveChangesAsync();
          return new ChuNhiemResType(200, "Cập nhật thành công");
        }
        else
        {
          return new ChuNhiemResType(200, "Không có sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ChuNhiemResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChuNhiemResType> DeletePC_ChuNhiem(int id)
    {
      try
      {
        var find = "SELECT * FROM PhanCongChuNhiem WHERE PhanCongChuNhiem = @id";

        var phanCongChuNhiem = await _context.PhanCongChuNhiems
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (phanCongChuNhiem is null)
        {
          return new ChuNhiemResType(404, "PC_ChuNhiemId not found");
        }

        var deleteQuery = "DELETE FROM PhanCongChuNhiem WHERE PhanCongChuNhiemId = @id";

        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));

        return new ChuNhiemResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ChuNhiemResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChuNhiemResType> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ChuNhiemResType(400, "Vui lòng cung cấp dữ liệu");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM PhanCongChuNhiem WHERE PhanCongChuNhiemId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ChuNhiemResType(404, "Dữ liệu bạn chọn không tồn tại");
        }

        await transaction.CommitAsync();

        return new ChuNhiemResType(200, "Đã xóa thành công");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ChuNhiemResType(500, $"Server error: {ex.Message}");
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
                  break;
                }

                var myPhanCongChuNhiem = new Models.PhanCongChuNhiem
                {
                  TeacherId = Convert.ToInt16(reader.GetValue(1)),
                  ClassId = Convert.ToInt16(reader.GetValue(2)),
                  Status = Convert.ToBoolean(reader.GetValue(3)),
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null,
                  Description = reader.GetValue(6).ToString()?.Trim() ?? null,
                  AcademicYearId = Convert.ToInt16(reader.GetValue(7)),
                };

                await _context.PhanCongChuNhiems.AddAsync(myPhanCongChuNhiem);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải danh sách thành công");
        }

        return new ResponseData<string>(400, "Không có tệp nào được tải lên");
      }
      catch (Exception ex)
      {
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }
  }
}
