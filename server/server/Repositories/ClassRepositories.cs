using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using server.Applications.ResponseModel;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;
using System.Text;

namespace server.Repositories
{
  public class ClassRepositories : BaseRepository<Class>, IClass
  {
    public ClassRepositories(SoDauBaiContext context) : base(context)
    {
    }

    protected override IQueryable<Class> ApplySearchFilter(IQueryable<Class> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm)) return query;

      return query.Where(x => x.Name.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm)));
    }

    public async Task<ClassDto> CreateClass(ClassDto model)
    {
      var gradeExists = await _context.Grades.AnyAsync(x => x.GradeId == model.GradeId);
      if (!gradeExists) throw new Exception("Khối lớp học không tồn tại");

      var teacherExists = await _context.Teachers.AnyAsync(x => x.TeacherId == model.TeacherId);
      if (!teacherExists) throw new Exception("Giáo viên không tồn tại");

      var acaExists = await _context.AcademicYears.AnyAsync(x => x.Id == model.AcademicYearId && x.Deleted == false);
      if (!acaExists) throw new Exception("Năm học không tồn tại");

      var schoolExists = await _context.Schools.AnyAsync(x => x.SchoolId == model.SchoolId);
      if (!schoolExists) throw new Exception("Trường học không tồn tại");

      var classExists = await _context.Classes.AnyAsync(x => x.Id == model.ClassId && x.Deleted == false);
      if (classExists) throw new Exception("Lớp học đã tồn tại");

      var newClass = new Class
      {
        GradeId = model.GradeId,
        TeacherId = model.TeacherId,
        AcademicYearId = model.AcademicYearId,
        SchoolId = model.SchoolId,
        Name = model.ClassName,
        Status = model.Status,
        Description = model.Description,
        DateCreated = DateTime.UtcNow,
        Deleted = false
      };

      await this.AddAsync(newClass);

      model.ClassId = newClass.Id;
      model.DateCreated = newClass.DateCreated;
      model.DateUpdated = newClass.DateUpdated;
      return model;
    }

    public async Task<List<ClassDto>> CreateClasses(List<ClassDto> models)
    {
      var responseList = new List<ClassDto>();

      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        foreach (var model in models)
        {
          var gradeExists = await _context.Grades.AnyAsync(x => x.GradeId == model.GradeId);
          if (!gradeExists) throw new Exception("Khối lớp học không tồn tại");

          var teacherExists = await _context.Teachers.AnyAsync(x => x.TeacherId == model.TeacherId);
          if (!teacherExists) throw new Exception("Giáo viên không tồn tại");

          var acaExists = await _context.AcademicYears.AnyAsync(x => x.Id == model.AcademicYearId && x.Deleted == false);
          if (!acaExists) throw new Exception("Năm học không tồn tại");

          var schoolExists = await _context.Schools.AnyAsync(x => x.SchoolId == model.SchoolId);
          if (!schoolExists) throw new Exception("Trường học không tồn tại");

          var classExists = await _context.Classes.AnyAsync(x => x.Id == model.ClassId && x.Deleted == false);
          if (classExists) throw new Exception("Lớp học đã tồn tại");

          var newClass = new Class
          {
            GradeId = model.GradeId,
            TeacherId = model.TeacherId,
            AcademicYearId = model.AcademicYearId,
            SchoolId = model.SchoolId,
            Name = model.ClassName,
            Status = model.Status,
            Description = model.Description,
            DateCreated = DateTime.UtcNow,
            Deleted = false
          };

          await _context.Classes.AddAsync(newClass);
          await _context.SaveChangesAsync();

          responseList.Add(new ClassDto
          {
            ClassId = newClass.Id,
            GradeId = model.GradeId,
            TeacherId = model.TeacherId,
            AcademicYearId = model.AcademicYearId,
            SchoolId = model.SchoolId,
            ClassName = model.ClassName,
            Status = model.Status,
            Description = model.Description,
            DateCreated = newClass.DateCreated,
            DateUpdated = newClass.DateUpdated
          });
        }

        await transaction.CommitAsync();
        return responseList;
      }
      catch (Exception)
      {
        await transaction.RollbackAsync();
        throw;
      }
    }

    public async Task<bool> DeleteClass(int id)
    {
      return await this.SoftDeleteAsync(id);
    }

    public async Task<ClassDetails> GetClass(int id)
    {
      var query = await _context.Classes
        .Where(x => x.Id == id && x.Deleted == false)
        .AsNoTracking()
        .Include(x => x.School)
        .Include(x => x.Teacher)
        .Include(x => x.Grade)
        .Include(x => x.AcademicYear)
        .Select(x => new ClassDetails
        {
          ClassId = x.Id,
          ClassName = x.Name,
          SchoolId = x.SchoolId,
          SchoolName = x.School.Name,
          TeacherId = x.TeacherId,
          TeacherName = x.Teacher.Fullname,
          GradeId = x.GradeId,
          GradeName = x.Grade.GradeName,
          AcademicYearId = x.AcademicYearId,
          NienKhoa = x.AcademicYear.DisplayAcademicYearName,
          Description = x.Description,
          Status = x.Status,
          DateCreated = x.DateCreated.HasValue ? x.DateCreated.Value.ToString("dd/MM/yyyy") : string.Empty,
          DateUpdated = x.DateUpdated.HasValue ? x.DateUpdated.Value.ToString("dd/MM/yyyy") : string.Empty,
        })
        .FirstOrDefaultAsync();

      if (query is null) throw new Exception("Không tìm thấy lớp học");
      return query;
    }

    public async Task<ClassDto> GetClassDetail(int id)
    {
      var query = await _context.Classes
        .Where(x => x.Id == id && x.Deleted == false)
        .AsNoTracking()
        .Select(x => new ClassDto
        {
          ClassId = x.Id,
          ClassName = x.Name,
          SchoolId = x.SchoolId,
          TeacherId = x.TeacherId,
          GradeId = x.GradeId,
          AcademicYearId = x.AcademicYearId,
          Description = x.Description,
          Status = x.Status,
          DateCreated = x.DateCreated,
          DateUpdated = x.DateUpdated,
        })
        .FirstOrDefaultAsync();

      if (query is null) throw new Exception("Không tìm thấy lớp học");
      return query;
    }

    public async Task<List<ClassDetails>> GetClasses(QueryObject? queryObject)
    {
      var query = _context.Classes
          .Where(x => x.Deleted == false)
          .AsNoTracking()
          .AsQueryable();

      if (queryObject != null)
      {
        if (!string.IsNullOrWhiteSpace(queryObject.Keyword))
        {
          query = query.Where(x => x.Name.Contains(queryObject.Keyword));
        }
        if (queryObject.GradeId.HasValue)
        {
          query = query.Where(x => x.GradeId == queryObject.GradeId.Value);
        }
        if (queryObject.TeacherId.HasValue)
        {
          query = query.Where(x => x.TeacherId == queryObject.TeacherId.Value);
        }
        if (queryObject.AcademicYearId.HasValue)
        {
          query = query.Where(x => x.AcademicYearId == queryObject.AcademicYearId.Value);
        }
        if (queryObject.SchoolId.HasValue)
        {
          query = query.Where(x => x.SchoolId == queryObject.SchoolId.Value);
        }
      }

      query = query.OrderBy(c => c.Id);

      if (queryObject != null)
      {
        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;
        query = query.Skip(skip).Take(queryObject.PageSize);
      }

      var classes = await query
          .Include(c => c.Grade)
          .Include(c => c.Teacher)
          .Include(c => c.AcademicYear)
          .Include(c => c.School)
          .Select(c => new ClassDetails
          {
            ClassId = c.Id,
            GradeId = c.GradeId,
            GradeName = c.Grade.GradeName,
            TeacherId = c.TeacherId,
            TeacherName = c.Teacher.Fullname,
            AcademicYearId = c.AcademicYearId,
            NienKhoa = c.AcademicYear.DisplayAcademicYearName,
            SchoolId = c.SchoolId,
            ClassName = c.Name,
            SchoolName = c.School.Name,
            Status = c.Status,
            Description = c.Description,
            DateCreated = c.DateCreated.HasValue ? c.DateCreated.Value.ToString("dd/MM/yyyy") : string.Empty,
            DateUpdated = c.DateUpdated.HasValue ? c.DateUpdated.Value.ToString("dd/MM/yyyy") : string.Empty,
          })
          .ToListAsync();

      return classes;
    }

    public async Task<PaginatedResponse<ClassList>> ClassList(QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();

      var query = _context.Classes.Where(x => x.Deleted == false).AsNoTracking().AsQueryable();

      if (!string.IsNullOrWhiteSpace(queryObject.Keyword))
      {
        query = query.Where(x => x.Name.Contains(queryObject.Keyword) ||
                                 (x.Description != null && x.Description.Contains(queryObject.Keyword)));
      }

      var totalCount = await query.CountAsync();

      var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

      var classes = await query
          .OrderBy(c => c.Id)
          .Skip(skip)
          .Take(queryObject.PageSize)
          .Select(c => new ClassList
          {
            ClassId = c.Id,
            GradeId = c.GradeId,
            TeacherId = c.TeacherId,
            AcademicYearId = c.AcademicYearId,
            SchoolId = c.SchoolId,
            ClassName = c.Name,
            Status = c.Status,
            Description = c.Description,
            DateCreated = c.DateCreated.HasValue ? c.DateCreated.Value.ToString("dd/MM/yyyy") : string.Empty,
            DateUpdated = c.DateUpdated.HasValue ? c.DateUpdated.Value.ToString("dd/MM/yyyy") : string.Empty,
          })
          .ToListAsync();

      return new PaginatedResponse<ClassList>
      {
        Items = classes,
        TotalCount = totalCount,
        PageNumber = queryObject.PageNumber,
        PageSize = queryObject.PageSize
      };
    }

    public async Task<PaginatedResponse<ClassDetails>> GetClassesBySchool(int schoolId, QueryObject? queryObject)
    {
      queryObject ??= new QueryObject();

      var query = _context.Classes
                .Where(c => c.SchoolId == schoolId && c.Deleted == false)
                .AsNoTracking()
                .AsQueryable();

      var totalCount = await query.CountAsync();

      var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

      var data = await query
                .OrderBy(c => c.Id)
                .Skip(skip)
                .Take(queryObject.PageSize)
                .Include(c => c.Grade)
                .Include(c => c.Teacher)
                .Include(c => c.AcademicYear)
                .Include(c => c.School)
                .Select(c => new ClassDetails
                {
                  ClassId = c.Id,
                  GradeId = c.GradeId,
                  GradeName = c.Grade.GradeName,
                  TeacherId = c.TeacherId,
                  TeacherName = c.Teacher.Fullname,
                  AcademicYearId = c.AcademicYearId,
                  SchoolId = c.SchoolId,
                  NienKhoa = c.AcademicYear.DisplayAcademicYearName,
                  ClassName = c.Name,
                  SchoolName = c.School.Name,
                  Status = c.Status,
                  Description = c.Description,
                  DateCreated = c.DateCreated.HasValue ? c.DateCreated.Value.ToString("dd/MM/yyyy") : string.Empty,
                  DateUpdated = c.DateUpdated.HasValue ? c.DateUpdated.Value.ToString("dd/MM/yyyy") : string.Empty,
                })
                .ToListAsync();

      return new PaginatedResponse<ClassDetails>
      {
        Items = data,
        TotalCount = totalCount,
        PageNumber = queryObject.PageNumber,
        PageSize = queryObject.PageSize
      };
    }

    public async Task<List<ClassDetails>> GetClassesBySchoolNoLimit(int schoolId)
    {
      var data = await _context.Classes
                .Where(c => c.SchoolId == schoolId && c.Deleted == false)
                .AsNoTracking()
                .OrderBy(c => c.Id)
                .Include(c => c.Grade)
                .Include(c => c.Teacher)
                .Include(c => c.AcademicYear)
                .Include(c => c.School)
                .Select(c => new ClassDetails
                {
                  ClassId = c.Id,
                  GradeId = c.GradeId,
                  GradeName = c.Grade.GradeName,
                  TeacherId = c.TeacherId,
                  TeacherName = c.Teacher.Fullname,
                  AcademicYearId = c.AcademicYearId,
                  SchoolId = c.SchoolId,
                  NienKhoa = c.AcademicYear.DisplayAcademicYearName,
                  ClassName = c.Name,
                  SchoolName = c.School.Name,
                  Status = c.Status,
                  Description = c.Description,
                  DateCreated = c.DateCreated.HasValue ? c.DateCreated.Value.ToString("dd/MM/yyyy") : string.Empty,
                  DateUpdated = c.DateUpdated.HasValue ? c.DateUpdated.Value.ToString("dd/MM/yyyy") : string.Empty,
                })
                .ToListAsync();

      return data;
    }

    public async Task<ClassDetails> GetLopChuNhiemByTeacherID(int teacherId)
    {
      var query = await _context.Classes
                .Where(c => c.TeacherId == teacherId && c.Status == true && c.Deleted == false)
                .AsNoTracking()
                .Include(c => c.Grade)
                .Include(c => c.Teacher)
                .Include(c => c.AcademicYear)
                .Include(c => c.School)
                .Select(c => new ClassDetails
                {
                  ClassId = c.Id,
                  GradeId = c.GradeId,
                  GradeName = c.Grade.GradeName,
                  TeacherId = c.TeacherId,
                  TeacherName = c.Teacher.Fullname,
                  AcademicYearId = c.AcademicYearId,
                  SchoolId = c.SchoolId,
                  NienKhoa = c.AcademicYear.DisplayAcademicYearName,
                  ClassName = c.Name,
                  SchoolName = c.School.Name,
                  Status = c.Status,
                  Description = c.Description,
                  DateCreated = c.DateCreated.HasValue ? c.DateCreated.Value.ToString("dd/MM/yyyy") : string.Empty,
                  DateUpdated = c.DateUpdated.HasValue ? c.DateUpdated.Value.ToString("dd/MM/yyyy") : string.Empty,
                })
                .SingleOrDefaultAsync();

      if (query is null) throw new Exception("Không tìm thấy lớp chủ nhiệm");
      return query;
    }

    public async Task<ClassDto> UpdateClass(int id, ClassDto model)
    {
      var existing = await GetByIdAsync(id) ?? throw new Exception("Không tìm thấy lớp học");

      if (model.GradeId != 0) existing.GradeId = model.GradeId;
      if (model.TeacherId != 0) existing.TeacherId = model.TeacherId;
      if (model.AcademicYearId != 0) existing.AcademicYearId = model.AcademicYearId;
      if (model.SchoolId != 0) existing.SchoolId = model.SchoolId;
      if (!string.IsNullOrEmpty(model.ClassName)) existing.Name = model.ClassName;
      if (model.Description != null) existing.Description = model.Description;
      existing.Status = model.Status;

      existing.DateUpdated = DateTime.UtcNow;

      await this.UpdateAsync(existing);

      model.DateUpdated = existing.DateUpdated;
      return model;
    }

    public async Task<string> ImportExcel(IFormFile file)
    {
      try
      {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

        if (file is not null && file.Length > 0)
        {
          var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");

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

                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null
                  && reader.GetValue(4) == null && reader.GetValue(5) == null && reader.GetValue(6) == null
                  && reader.GetValue(7) == null)
                {
                  break;
                }

                var myClass = new Models.Class
                {
                  GradeId = Convert.ToInt32(reader.GetValue(1)),
                  TeacherId = Convert.ToInt32(reader.GetValue(2)),
                  AcademicYearId = Convert.ToInt32(reader.GetValue(3)),
                  SchoolId = Convert.ToInt32(reader.GetValue(4)),
                  Name = reader.GetValue(5)?.ToString() ?? "Unknown",
                  Status = Convert.ToBoolean(reader.GetValue(6)),
                  Description = reader.GetValue(7)?.ToString(),
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null,
                  Deleted = false
                };

                await _context.Classes.AddAsync(myClass);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }
          return "Tải lên file thành công";
        }
        throw new Exception("Không có file nào được chọn");

      }
      catch (Exception ex)
      {
        throw new Exception($"Lỗi khi tải lên file: {ex.Message}");
      }
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        if (ids == null || !ids.Any()) throw new Exception("Vui lòng cung cấp lớp học muốn xóa");

        var result = await BulkDeleteAsync(ids);
        if (!result) throw new Exception("Không tìm thấy lớp học");

        await transaction.CommitAsync();

        return true;
      }
      catch (Exception)
      {
        await transaction.RollbackAsync();
        throw;
      }
    }
  }
}
