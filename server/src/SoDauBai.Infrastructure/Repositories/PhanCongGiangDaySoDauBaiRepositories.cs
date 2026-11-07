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
using SoDauBai.Application.DTOs.Types.PhanCongGDBia;
using System.Text;

namespace SoDauBai.Infrastructure.Repositories
{
  public class PhanCongGiangDaySoDauBaiRepositories : BaseRepository<PhanCongGiangDay>, IPhanCongGiangDaySoDauBai
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public PhanCongGiangDaySoDauBaiRepositories(IHttpContextAccessor httpContextAccessor, SoDauBaiContext context, IMapper mapper)
      : base(context)
    {
      _mapper = mapper;
      _httpContextAccessor = httpContextAccessor;
    }

    public async Task<PC_GiangDay_BiaSDBDto> AddAsync(PC_GiangDay_BiaSDBDto model)
    {
      if (model is null)
        throw new BadRequestException("Vui lòng cung cấp dữ liệu hợp lệ");

      var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == model.TeacherId && t.Deleted == false);
      if (!teacherExists)
        throw new NotFoundException("Mã giáo viên không tồn tại");

      var biaExists = await _context.BiaSoDauBais.AnyAsync(b => b.Id == model.BiaSoDauBaiId && b.Deleted == false);
      if (!biaExists)
        throw new NotFoundException("Mã bìa sổ đầu bài không tồn tại");

      var entity = _mapper.Map<PC_GiangDay_BiaSDBDto, PhanCongGiangDay>(model);
      var result = await base.AddAsync(entity);
      return _mapper.Map<PhanCongGiangDay, PC_GiangDay_BiaSDBDto>(result);
    }

    public async Task<MapData?> GetByIDAsync(int id)
    {
      var item = await _dbSet
        .Where(x => x.Id == id && x.Deleted == false)
        .Include(x => x.Teacher)
          .ThenInclude(t => t!.Classes)
        .Include(x => x.BiaSoDauBai)
        .AsNoTracking()
        .FirstOrDefaultAsync();

      if (item is null)
        return null;

      var firstClass = item.Teacher?.Classes.FirstOrDefault();
      return new MapData
      {
        PhanCongGiangDayId = item.Id,
        BiaSoDauBaiId = item.BiaSoDauBaiId,
        TeacherId = item.TeacherId,
        Status = item.Status,
        DateCreated = item.DateCreated,
        DateUpdated = item.DateUpdated,
        TeacherName = item.Teacher?.Fullname,
        ClassId = firstClass?.Id ?? 0,
        ClassName = firstClass?.Name
      };
    }

    public async Task<MapData?> GetPhanCongGiangDayByBia(int biaId)
    {
      var item = await _dbSet
        .Where(x => x.BiaSoDauBaiId == biaId && x.Deleted == false)
        .Include(x => x.Teacher)
          .ThenInclude(t => t!.Classes)
        .Include(x => x.BiaSoDauBai)
        .AsNoTracking()
        .FirstOrDefaultAsync();

      if (item is null)
        return null;

      var firstClass = item.Teacher?.Classes.FirstOrDefault();
      return new MapData
      {
        PhanCongGiangDayId = item.Id,
        BiaSoDauBaiId = item.BiaSoDauBaiId,
        TeacherId = item.TeacherId,
        Status = item.Status,
        DateCreated = item.DateCreated,
        DateUpdated = item.DateUpdated,
        TeacherName = item.Teacher?.Fullname,
        ClassId = firstClass?.Id ?? 0,
        ClassName = firstClass?.Name
      };
    }

    protected override IQueryable<PhanCongGiangDay> ApplySearchFilter(IQueryable<PhanCongGiangDay> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => (x.Teacher != null && x.Teacher.Fullname.Contains(searchTerm)));
    }

    public async Task<PaginatedResponse<MapData>> GetPC_GiangDay_BiaSDBs(PhanCongGiangDaySearch request)
    {
      var query = _dbSet
        .Where(x => x.Deleted == false)
        .Include(x => x.Teacher)
          .ThenInclude(t => t!.Classes)
        .Include(x => x.BiaSoDauBai)
        .AsNoTracking()
        .AsQueryable();

      if (!string.IsNullOrWhiteSpace(request.Keyword))
      {
        query = ApplySearchFilter(query, request.Keyword);
      }

      if (request.BiaSoDauBaiId.HasValue)
      {
        query = query.Where(x => x.BiaSoDauBaiId == request.BiaSoDauBaiId.Value);
      }

      if (request.TeacherId.HasValue)
      {
        query = query.Where(x => x.TeacherId == request.TeacherId.Value);
      }

      if (request.Status.HasValue)
      {
        query = query.Where(x => x.Status == request.Status.Value);
      }

      var totalCount = await query.CountAsync();
      var skip = (request.PageNumber - 1) * request.PageSize;

      var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();

      var mapped = items.Select(x =>
      {
        var firstClass = x.Teacher?.Classes.FirstOrDefault();
        return new MapData
        {
          PhanCongGiangDayId = x.Id,
          BiaSoDauBaiId = x.BiaSoDauBaiId,
          TeacherId = x.TeacherId,
          Status = x.Status,
          DateCreated = x.DateCreated,
          DateUpdated = x.DateUpdated,
          TeacherName = x.Teacher?.Fullname,
          ClassId = firstClass?.Id ?? 0,
          ClassName = firstClass?.Name
        };
      }).ToList();

      return new PaginatedResponse<MapData>
      {
        Items = mapped,
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };
    }

    public async Task<PC_GiangDay_BiaSDBDto> UpdateAsync(int id, PC_GiangDay_BiaSDBDto model)
    {
      model.Id = id;
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy phân công giảng dạy");
      _mapper.Map(model, existing);
      existing.DateUpdated = DateTime.UtcNow;
      var updated = await base.UpdateAsync(existing);
      return _mapper.Map<PhanCongGiangDay, PC_GiangDay_BiaSDBDto>(updated);
    }

    public override async Task<bool> DeleteAsync(int id)
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

                var teacherId = Convert.ToInt32(reader.GetValue(1));
                var biaId = Convert.ToInt32(reader.GetValue(2));
                var status = Convert.ToBoolean(reader.GetValue(3));

                var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == teacherId && t.Deleted == false);
                if (!teacherExists)
                  return new ResponseData<string>(404, $"Mã giáo viên {teacherId} không tồn tại");

                var biaExists = await _context.BiaSoDauBais.AnyAsync(b => b.Id == biaId && b.Deleted == false);
                if (!biaExists)
                  return new ResponseData<string>(404, $"Mã bìa {biaId} không tồn tại");

                var entity = new PhanCongGiangDay
                {
                  TeacherId = teacherId,
                  BiaSoDauBaiId = biaId,
                  Status = status,
                  DateCreated = DateTime.UtcNow,
                  Deleted = false
                };

                await _context.PhanCongGiangDays.AddAsync(entity);
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


