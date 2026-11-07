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
using SoDauBai.Application.DTOs.Types.Week;
using System.Globalization;
using System.Text;

namespace SoDauBai.Infrastructure.Repositories
{
  public class WeekRepositories : BaseRepository<Week>, IWeek
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public WeekRepositories(IHttpContextAccessor httpContextAccessor, SoDauBaiContext context, IMapper mapper) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<Week> AddAsync(WeekDto model)
    {
      if (model is null)
        throw new BadRequestException("Vui lòng cung cấp thông tin tuần học hợp lệ");

      var semester = await _context.Semesters.FirstOrDefaultAsync(x => x.Id == model.SemesterId && x.Deleted == false)
        ?? throw new NotFoundException("Không tìm thấy học kỳ");

      var dto = _mapper.Map<WeekDto, Week>(model);
      return await base.AddAsync(dto);
    }

    public async Task<Week?> GetByIDAsync(int id)
    {
      var result = await _dbSet.Where(x => x.Id == id && x.Deleted == false).Include(x => x.Semester).FirstOrDefaultAsync();
      return result;
    }

    protected override IQueryable<Week> ApplySearchFilter(IQueryable<Week> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Name.Contains(searchTerm) || (x.Semester != null && x.Semester.Name.Contains(searchTerm)));
    }

    public async Task<PaginatedResponse<ExtendWeek>> GetWeeks(WeekSearch request)
    {
      var query = _dbSet.Where(x => x.Deleted == false).Include(x => x.Semester).AsNoTracking().AsQueryable();

      if (!string.IsNullOrWhiteSpace(request.Keyword))
      {
        query = ApplySearchFilter(query, request.Keyword);
      }

      if (request.SemesterId.HasValue)
      {
        query = query.Where(x => x.SemesterId == request.SemesterId);
      }

      if (request.Status.HasValue)
      {
        query = query.Where(x => x.Status == request.Status.Value);
      }

      var totalCount = await query.CountAsync();
      var skip = (request.PageNumber - 1) * request.PageSize;

      var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();
      return new PaginatedResponse<ExtendWeek>
      {
        Items = _mapper.Map<List<Week>, List<ExtendWeek>>(items),
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };
    }

    public async Task<Week> UpdateAsync(int id, WeekDto model)
    {
      model.Id = id;
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy dữ liệu");
      _mapper.Map(model, existing);
      existing.DateUpdated = DateTime.UtcNow;
      return await base.UpdateAsync(existing);
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

                // Check if there are no more rows or empty rows
                if (reader.GetValue(1) == null && reader.GetValue(2) == null
                && reader.GetValue(3) == null && reader.GetValue(4) == null && reader.GetValue(5) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var semesterId = Convert.ToInt16(reader.GetValue(1));
                var semesterExists = await _context.Semesters.AnyAsync(g => g.Id == semesterId && g.Deleted == false);

                if (!semesterExists)
                  return new ResponseData<string>(404, $"Mã học kỳ {semesterId} không tồn tại");

                var myWeek = new Week
                {
                  SemesterId = semesterId,
                  Name = reader.GetValue(2)?.ToString() ?? "null",
                  WeekStart = reader.GetValue(3) != null ? Convert.ToDateTime(reader.GetValue(3)) : null,
                  WeekEnd = reader.GetValue(4) != null ? Convert.ToDateTime(reader.GetValue(4)) : null,
                  Status = reader.GetValue(5) != null && Convert.ToBoolean(reader.GetValue(5))
                };
                await _context.Weeks.AddAsync(myWeek);
              }
              await _context.SaveChangesAsync();
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(200, "Không có tệp nào được tải lên");
      }
      catch (Exception)
      {
        return new ResponseData<string>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
      }
    }

    public async Task<WeekResType> Get7DaysInWeek(int selectedWeekId)
    {
      try
      {
        var selectedWeek = await _context.Weeks
          .AsNoTracking()
          .FirstOrDefaultAsync(x => x.Id == selectedWeekId && x.Deleted == false);

        if (selectedWeek == null)
        {
          return new WeekResType(404, "Không tìm thấy");
        }

        var daysInWeek = new List<SevenDaysInWeek>();

        // Align `currentDate` to the nearest Monday
        var currentDate = selectedWeek.WeekStart;

        if (currentDate.HasValue)
        {
          var dayOfWeek = (int)currentDate.Value.DayOfWeek;
          int offsetToMonday = (dayOfWeek == 0 ? -6 : 1) - dayOfWeek;
          currentDate = currentDate.Value.AddDays(offsetToMonday);

          for (int i = 0; i < 7; i++)
          {
            daysInWeek.Add(new SevenDaysInWeek
            {
              Day = currentDate?.ToString("dddd", new CultureInfo("vi-VN")),
              Date = currentDate?.ToString("dd/MM/yyyy")
            });

            currentDate = currentDate.Value.AddDays(1);
          }
        }
        else
        {
          return new WeekResType(400, "WeekStart date is null");
        }

        return new WeekResType(200, "Thành công", daysInWeek);
      }
      catch (Exception ex)
      {
        return new WeekResType(500, $"Server error: {ex.Message}");
      }
    }
  }
}



