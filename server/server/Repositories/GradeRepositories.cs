using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.Models;
using server.Types.Grade;
using AutoMapper;
using server.Common.Exceptions;
using server.Interfaces;
using server.Applications.Search;

namespace server.Repositories
{
  public class GradeRepositories : BaseRepository<Grade>, IGrade
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public GradeRepositories(SoDauBaiContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    protected override IQueryable<Grade> ApplySearchFilter(IQueryable<Grade> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Name.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm)));
    }

    public async Task<Tuple<IEnumerable<GradeDetail>, int, int, int>> GetAllAsync(GradeSearch request)
    {
      var query = _context.Grades
        .Where(x => x.Deleted == false && x.AcademicYear.Status)
        .AsNoTracking()
        .AsQueryable();

      if (request != null)
      {
        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
          query = query.Where(x => x.Name.Contains(request.Keyword));
        }
        if (request.AcademicYearId.HasValue)
        {
          query = query.Where(x => x.AcademicYearId == request.AcademicYearId.Value);
        }
      }
      var totalCount = await query.CountAsync();
      query = query.OrderBy(c => c.Id);
      var skip = (request!.PageNumber - 1) * request.PageSize;
      query = query.Skip(skip).Take(request.PageSize);

      var data = await query
          .Include(x => x.AcademicYear)
          .Select(x => new GradeDetail
          {
            Id = x.Id,
            Name = x.Name,
            Description = x.Description,
            AcademicYearId = x.AcademicYearId,
            DisplayAcademicYearName = x.AcademicYear.Name,
            YearStart = x.AcademicYear.YearStart,
            YearEnd = x.AcademicYear.YearEnd,
            DateCreated = x.DateCreated,
            DateUpdated = x.DateUpdated
          })
          .ToListAsync();

      return new Tuple<IEnumerable<GradeDetail>, int, int, int>(data, request.PageNumber, request.PageSize, totalCount);
    }

    public async Task<Grade> GetAsync(int id)
    {
      var result = await _dbSet.Include(x => x.AcademicYear).FirstOrDefaultAsync(x => x.Id == id && x.Deleted == false && x.AcademicYear.Status)
        ?? throw new NotFoundException("Không tìm thấy khối lớp học");
      return result;
    }

    public async Task<Grade> AddAsync(GradeDto model)
    {
      var acaExists = await _context.AcademicYears.AnyAsync(a => a.Id == model.AcademicYearId);
      if (!acaExists) throw new NotFoundException("Năm học không tồn tại");

      var dto = _mapper.Map<Grade>(model);
      var userIdStr = _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value;
      if (int.TryParse(userIdStr, out int userId))
      {
        dto.CreatedBy = userId;
      }

      dto.DateCreated = DateTime.UtcNow;
      return await this.AddAsync(dto);
    }

    public async Task<bool> DeleteAsync(int id)
    {
      return await this.SoftDeleteAsync(id);
    }

    public async Task<Grade> UpdateAsync(int id, GradeDto model)
    {
      var existing = await GetByIdAsync(id);
      if (existing == null) throw new NotFoundException("Không tìm thấy khối lớp học");

      if (model.AcademicYearId != 0 && model.AcademicYearId != existing.AcademicYearId)
      {
        var acaExists = await _context.AcademicYears.AnyAsync(a => a.Id == model.AcademicYearId);
        if (!acaExists) throw new NotFoundException("Năm học không tồn tại");
        existing.AcademicYearId = model.AcademicYearId;
      }

      if (!string.IsNullOrEmpty(model.Name)) existing.Name = model.Name;
      if (model.Description != null) existing.Description = model.Description;
      var dto = _mapper.Map<Grade>(model);
      var userIdStr = _httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value;
      if (int.TryParse(userIdStr, out int userId))
      {
        dto.UpdatedBy = userId;
      }
      existing.DateUpdated = DateTime.UtcNow;

      return await this.UpdateAsync(existing);
    }

    public async Task<bool> BulkDeleteAsync(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var result = await base.BulkDeleteAsync(ids);
        await transaction.CommitAsync();

        return true;
      }
      catch (Exception)
      {
        await transaction.RollbackAsync();
        return false;
      }
    }

    public async Task<string> ImportExcel(IFormFile file)
    {
      try
      {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

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

          using (var stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read))
          {
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
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

                  var acaId = Convert.ToInt16(reader.GetValue(1));

                  var myGrade = new Models.Grade
                  {
                    AcademicYearId = acaId,
                    Name = reader.GetValue(2)?.ToString()?.Trim() ?? "Khoi lop",
                    Description = reader.GetValue(3)?.ToString()?.Trim() ?? "Mo ta",
                    DateCreated = DateTime.UtcNow
                  };

                  await _context.Grades.AddAsync(myGrade);
                  await _context.SaveChangesAsync();
                }
              } while (reader.NextResult());
            }
          }

          return "Tải lên thành công";
        }
        return "No file uploaded";
      }
      catch (Exception ex)
      {
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<GradeResType> ExportGradesExcel(List<int> ids, string filePath)
    {
      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new GradeResType(400, "Không có id nào!");
        }

        var grades = await _context.Grades
          .Include(x => x.AcademicYear)
          .Where(x => ids.Contains(x.Id))
          .ToListAsync();

        if (grades is null || !grades.Any())
        {
          return new GradeResType(404, "Không tìm thấy id");
        }

        using (var workbook = new XLWorkbook())
        {
          var worksheet = workbook.Worksheets.Add("Grades");

          // Headers
          worksheet.Cell(1, 1).Value = "Mã khối lớp";
          worksheet.Cell(1, 2).Value = "Mã năm học";
          worksheet.Cell(1, 3).Value = "Tên khối lớp";
          worksheet.Cell(1, 4).Value = "Mô tả";
          worksheet.Cell(1, 5).Value = "Năm học";

          for (int i = 0; i < grades.Count; i++)
          {
            var grade = grades[i];
            worksheet.Cell(i + 2, 1).Value = grade.Id;
            worksheet.Cell(i + 2, 2).Value = grade.AcademicYearId;
            worksheet.Cell(i + 2, 3).Value = grade.Name;
            worksheet.Cell(i + 2, 4).Value = grade.Description;
            worksheet.Cell(i + 2, 5).Value = grade.AcademicYear?.Name;
          }

          worksheet.Columns().AdjustToContents();
          workbook.SaveAs(filePath);
        }

        return new GradeResType(200, "Thành công");
      }
      catch (Exception ex)
      {
        return new GradeResType(500, $"Server error: {ex.Message}");
      }
    }
  }
}
