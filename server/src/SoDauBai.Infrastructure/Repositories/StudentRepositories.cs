using AutoMapper;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.Common.Exceptions;
using SoDauBai.Infrastructure.Data;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Domain.Entities;
using System.Text;

namespace SoDauBai.Infrastructure.Repositories
{
  public class StudentRepositories : BaseRepository<Student>, IStudent
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public StudentRepositories(IHttpContextAccessor httpContextAccessor, SoDauBaiContext context, IMapper mapper) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<StudentDto> AddAsync(StudentDto model)
    {
      if (model is null)
        throw new BadRequestException("Vui lòng cung cấp thông tin học sinh hợp lệ");

      var classExists = await _context.Classes.AnyAsync(x => x.Id == model.ClassId && x.Deleted == false);
      if (!classExists)
        throw new NotFoundException("Không tìm thấy lớp học");

      var student = _mapper.Map<StudentDto, Student>(model);
      var result = await base.AddAsync(student);
      return _mapper.Map<Student, StudentDto>(result);
    }

    public async Task<StudentDetail?> GetByIDAsync(int id)
    {
      var student = await _dbSet
        .Where(s => s.Id == id && s.Deleted == false)
        .Include(s => s.Class)
        .Include(s => s.User)
          .ThenInclude(u => u!.School)
        .AsNoTracking()
        .FirstOrDefaultAsync();

      if (student is null)
        return null;

      var result = _mapper.Map<Student, StudentDetail>(student);
      if (student.User != null)
      {
        result.Email = student.User.Email;
        result.SchoolId = student.User.SchoolId;
        result.SchoolName = student.User.School?.Name;
      }
      result.ClassName = student.Class?.Name;
      return result;
    }

    protected override IQueryable<Student> ApplySearchFilter(IQueryable<Student> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Fullname.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm)));
    }

    public async Task<PaginatedResponse<StudentDetail>> GetStudents(StudentSearch request)
    {
      var query = _dbSet
        .Where(x => x.Deleted == false)
        .Include(x => x.Class)
        .Include(x => x.User)
          .ThenInclude(u => u!.School)
        .AsNoTracking()
        .AsQueryable();

      if (!string.IsNullOrWhiteSpace(request.Keyword))
      {
        query = ApplySearchFilter(query, request.Keyword);
      }

      if (request.ClassId.HasValue)
      {
        query = query.Where(x => x.ClassId == request.ClassId.Value);
      }

      if (request.GradeId.HasValue)
      {
        query = query.Where(x => x.GradeId == request.GradeId.Value);
      }

      if (request.SchoolId.HasValue)
      {
        query = query.Where(x => x.User != null && x.User.SchoolId == request.SchoolId.Value);
      }

      if (request.Status.HasValue)
      {
        query = query.Where(x => x.Status == request.Status.Value);
      }

      var totalCount = await query.CountAsync();
      var skip = (request.PageNumber - 1) * request.PageSize;

      var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();

      var mappedItems = items.Select(student =>
      {
        var detail = _mapper.Map<Student, StudentDetail>(student);
        if (student.User != null)
        {
          detail.Email = student.User.Email;
          detail.SchoolId = student.User.SchoolId;
          detail.SchoolName = student.User.School?.Name;
        }
        detail.ClassName = student.Class?.Name;
        return detail;
      }).ToList();

      return new PaginatedResponse<StudentDetail>
      {
        Items = mappedItems,
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };
    }

    public async Task<List<StudentDetail>> GetStudentsByClass(int schoolId, int classId)
    {
      var items = await _dbSet
        .Where(x => x.Deleted == false && x.ClassId == classId && (x.User == null || x.User.SchoolId == schoolId))
        .Include(x => x.Class)
        .Include(x => x.User)
          .ThenInclude(u => u!.School)
        .AsNoTracking()
        .ToListAsync();

      return items.Select(student =>
      {
        var detail = _mapper.Map<Student, StudentDetail>(student);
        if (student.User != null)
        {
          detail.Email = student.User.Email;
          detail.SchoolId = student.User.SchoolId;
          detail.SchoolName = student.User.School?.Name;
        }
        detail.ClassName = student.Class?.Name;
        return detail;
      }).ToList();
    }

    public async Task<StudentDto> UpdateAsync(int id, StudentDto model)
    {
      model.Id = id;
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy học sinh");
      _mapper.Map(model, existing);
      existing.DateUpdated = DateTime.UtcNow;
      var updated = await base.UpdateAsync(existing);
      return _mapper.Map<Student, StudentDto>(updated);
    }

    public override async Task<bool> DeleteAsync(int id)
    {
      return await base.SoftDeleteAsync(id);
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      return await base.SoftBulkDeleteAsync(ids);
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

                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null
                  && reader.GetValue(4) == null && reader.GetValue(5) == null)
                {
                  break;
                }

                var myStudent = new Student
                {
                  ClassId = Convert.ToInt32(reader.GetValue(1)),
                  GradeId = Convert.ToInt32(reader.GetValue(2)),
                  UserId = Convert.ToInt32(reader.GetValue(3)),
                  Fullname = reader.GetValue(4)?.ToString() ?? "Undefined",
                  Status = reader.GetValue(5) != null && Convert.ToBoolean(reader.GetValue(5)),
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null,
                  Description = reader.GetValue(8)?.ToString() ?? $"{DateTime.UtcNow}",
                  DateOfBirth = reader.GetValue(9) != null ? Convert.ToDateTime(reader.GetValue(9)) : null,
                  Address = reader.GetValue(10)?.ToString() ?? ""
                };

                await _context.Students.AddAsync(myStudent);
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
        return new ResponseData<string>(500, $"Error while uploading file: {ex.Message}");
      }
    }
  }
}



