using AutoMapper;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Common.Exceptions;
using server.Data;
using server.Dtos;
using server.Interfaces;
using server.IService;
using server.Models;
using server.Types.Teacher;
using System.Text;

namespace server.Repositories
{
  public class TeacherRepositories : BaseRepository<Teacher>, ITeacher
  {
    private readonly IMapper _mapper;
    private readonly IPhotoService _photo;
    private readonly IUser _user;
    private readonly ISchool _school;
    private readonly ISessionUser _sessionUser;
    private readonly IFileUploadService _service;

    public TeacherRepositories(IFileUploadService service, ISessionUser sessionUser, IMapper mapper, SoDauBaiContext context, IPhotoService photo, IUser user, ISchool school) : base(context)
    {
      this._photo = photo;
      this._mapper = mapper;
      this._school = school;
      this._user = user;
      this._sessionUser = sessionUser;
      this._service = service;
    }

    public async Task<Teacher> AddAsync(TeacherCreateBody model)
    {
      _ = await _user.GetUser(model.UserId) ?? throw new NotFoundException("Không tìm thấy tài khoản");
      _ = await _school.GetSchool(model.SchoolId) ?? throw new NotFoundException("Không tìm thấy trường học");
      var dto = _mapper.Map<TeacherCreateBody, Teacher>(model);
      var result = await base.AddAsync(dto);
      return result;
    }

    public async Task<ExtendTeacher> GetByIDAsync(int id)
    {
      var result = await _dbSet.Where(x => x.Id == id).Include(x => x.School).Include(x => x.User).FirstOrDefaultAsync();
      return _mapper.Map<Teacher, ExtendTeacher>(result);
    }

    protected override IQueryable<Teacher> ApplySearchFilter(IQueryable<Teacher> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Fullname.Contains(searchTerm));
    }

    public async Task<PaginatedResponse<ExtendTeacher>> GetAllAsync(TeacherSearch request)
    {
      var query = _dbSet
        .Where(x => x.Deleted == false)
        .Include(x => x.User)
        .Include(c => c.School)
        .AsNoTracking()
        .AsQueryable();

      if (request.SchoolId.HasValue)
        query = query.Where(x => x.SchoolId == request.SchoolId);

      if (request.UserId.HasValue)
        query = query.Where(x => x.UserId == request.UserId);

      var totalCount = await query.CountAsync();
      var skip = (request.PageNumber - 1) * request.PageSize;

      var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();

      return new PaginatedResponse<ExtendTeacher>
      {
        Items = _mapper.Map<List<Teacher>, List<ExtendTeacher>>(items),
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };
    }

    public async Task<Teacher> UpdateAsync(int id, TeacherCreateBody model)
    {
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy giáo viên");
      _mapper.Map(model, existing);
      existing.UpdatedBy = _sessionUser.UserId;
      existing.DateUpdated = DateTime.UtcNow;
      return await base.UpdateAsync(existing);
    }

    public override async Task<bool> DeleteAsync(int id)
    {
      return await base.SoftDeleteAsync(id);
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      return await base.BulkDeleteAsync(ids);
    }

    public async Task<Teacher> UpdateImageAsync(int id, IFormFile file)
    {
      if (file == null || file.Length == 0)
      {
        throw new BadRequestException("File ảnh không hợp lệ hoặc rỗng.");
      }

      var teacher = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy giáo viên.");
      if (!string.IsNullOrWhiteSpace(teacher.PhotoPath))
      {
        _service.DeleteFile(teacher.PhotoPath);
      }

      var photoPath = await _service.UploadFileAsync(file, "Teacher");

      teacher.PhotoPath = photoPath;
      teacher.DateUpdated = DateTime.UtcNow;
      teacher.UpdatedBy = _sessionUser.UserId;

      await _context.SaveChangesAsync();
      return teacher;
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
                  UserId = Convert.ToInt16(reader.GetValue(1)),
                  SchoolId = Convert.ToInt16(reader.GetValue(2)),
                  Fullname = reader.GetValue(3).ToString()?.Trim() ?? "Fullname",
                  DateOfBirth = Convert.ToDateTime(reader.GetValue(4)),
                  Gender = Convert.ToBoolean(reader.GetValue(5)),
                  Address = reader.GetValue(6).ToString()?.Trim() ?? "address",
                  Status = Convert.ToBoolean(reader.GetValue(7)),
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null,
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
  }
}
