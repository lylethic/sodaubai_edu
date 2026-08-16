using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.Interfaces;
using server.Models;
using server.Applications.ResponseModel;
using System.Text;
using AutoMapper;
using server.Common.Exceptions;
using server.Applications.Search;
using Microsoft.AspNetCore.Http.HttpResults;

namespace server.Repositories
{
  public class PhanCongChuNhiemRepositories : BaseRepository<PhanCongChuNhiem>, IPhanCongChuNhiem
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PhanCongChuNhiemRepositories(IHttpContextAccessor httpContextAccessor, IMapper mapper, SoDauBaiContext context) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<PhanCongChuNhiem> AddAsync(PhanCongChuNhiemDto model)
    {
      var teacherExisting = await _context.Teachers.Where(t => t.Id == model.TeacherId && t.Deleted == false).FirstOrDefaultAsync() ?? throw new BadRequestException("Không tìm thấy giáo viên");

      var academicYearExisting = await _context.AcademicYears.Where(t => t.Id == model.AcademicYearId && t.Deleted == false).FirstOrDefaultAsync() ?? throw new BadRequestException("Không tìm thấy năm học");

      var classExisting = await _context.Classes.Where(t => t.Id == model.ClassId && t.Deleted == false).FirstOrDefaultAsync() ?? throw new BadRequestException("Không tìm thấy lớp học");

      var result = _dbSet
          .Where(c => c.ClassId != model.ClassId && c.AcademicYearId != model.AcademicYearId && c.TeacherId != model.TeacherId)
          .AsNoTracking()
          .AsQueryable();

      if (await result.AnyAsync())
      {
        throw new BadRequestException($"Giáo viên đã được phân công chủ nhiệm trong năm học này");
      }

      var dto = _mapper.Map<PhanCongChuNhiemDto, PhanCongChuNhiem>(model);
      return await base.AddAsync(dto);
    }

    public async Task<ExtendPhanCongChuNhiem> GetByIDAsync(int id)
    {
      try
      {
        var result = await _dbSet
            .Include(x => x.Teacher)
            .Include(x => x.Class)
                .ThenInclude(c => c.School)
            .Include(x => x.AcademicYear)
            .FirstOrDefaultAsync(x => x.Id == id && x.Deleted == false)
          ?? throw new NotFoundException("Không tìm thấy dữ liệu");
        return _mapper.Map<PhanCongChuNhiem, ExtendPhanCongChuNhiem>(result);
      }
      catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }
    }

    protected override IQueryable<PhanCongChuNhiem> ApplySearchFilter(IQueryable<PhanCongChuNhiem> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Teacher.Fullname.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm)));
    }

    public async Task<PaginatedResponse<ExtendPhanCongChuNhiem>> GetAllAsync(PhanCongChuNhiemSearch request)
    {
      try
      {
        var query = _dbSet
            .Where(x => x.Deleted == false)
            .Include(x => x.Teacher)
            .Include(x => x.Class)
                .ThenInclude(c => c.School)
            .Include(x => x.AcademicYear)
            .AsNoTracking()
            .AsQueryable();

        if (request.SchoolId.HasValue)
        {
          query = query.Where(x => x.Class.SchoolId == request.SchoolId);
        }

        if (request.AcademicYearId.HasValue)
        {
          query = query.Where(x => x.AcademicYearId == request.AcademicYearId);
        }
        if (request.TeacherId.HasValue)
        {
          query = query.Where(x => x.TeacherId == request.TeacherId);
        }
        if (request.ClassId.HasValue)
        {
          query = query.Where(x => x.ClassId == request.ClassId);
        }

        var totalCount = await query.CountAsync();
        var skip = (request.PageNumber - 1) * request.PageSize;

        var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();

        return new PaginatedResponse<ExtendPhanCongChuNhiem>
        {
          Items = _mapper.Map<List<PhanCongChuNhiem>, List<ExtendPhanCongChuNhiem>>(items),
          TotalCount = totalCount,
          PageNumber = request.PageNumber,
          PageSize = request.PageSize
        };
      }
      catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }
    }
    public async Task<PhanCongChuNhiem> UpdateAsync(int id, PhanCongChuNhiemDto model)
    {
      model.Id = id;
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy dữ liệu");
      _mapper.Map(model, existing);
      existing.UpdatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);
      existing.DateUpdated = DateTime.UtcNow;
      return await base.UpdateAsync(existing);
    }

    public async Task<bool> Async(int id)
    {
      return await base.SoftDeleteAsync(id);
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      return await base.SoftBulkDeleteAsync(ids);
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
                  Deleted = false
                };

                await base.AddAsync(myPhanCongChuNhiem);
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
