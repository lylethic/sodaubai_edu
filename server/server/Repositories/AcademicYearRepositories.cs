using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;
using server.Applications.ResponseModel;

namespace server.Repositories
{
  public class AcademicYearRepositories : BaseRepository<AcademicYear>, IAcademicYear
  {
    public AcademicYearRepositories(SoDauBaiContext context) : base(context)
    {
    }

    protected override IQueryable<AcademicYear> ApplySearchFilter(IQueryable<AcademicYear> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Name.Contains(searchTerm) ||
                              (x.Description != null && x.Description.Contains(searchTerm)));
    }

    public async Task<PaginatedResponse<AcademicYear>> GetAcademicYears(QueryObject request)
    {
      var result = await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);

      return new PaginatedResponse<AcademicYear>
      {
        Items = result.Items,
        PageNumber = result.PageNumber,
        PageSize = result.PageSize,
        TotalCount = result.TotalCount
      };
    }

    public async Task<AcademicYear> GetAcademicYear(int id)
    {
      var result = await GetByIdAsync(id) ?? throw new Exception("Không tìm thấy năm học");
      return result;
    }

    public async Task<AcademicYear> CreateAcademicYear(AcademicYearDto model)
    {
      var existing = await _context.AcademicYears.FirstOrDefaultAsync(x => x.Name == model.Name);
      if (existing != null) throw new Exception("Năm học đã tồn tại");

      var academicYear = new AcademicYear
      {
        Name = model.Name,
        YearStart = model.YearStart,
        YearEnd = model.YearEnd,
        Description = model.Description,
        Status = model.Status,
        DateCreated = DateTime.Now
      };

      return await this.AddAsync(academicYear);
    }

    public async Task<AcademicYear> UpdateAcademicYear(int id, AcademicYearDto model)
    {
      var existing = await GetByIdAsync(id) ?? throw new Exception("Không tìm thấy năm học");

      if (!string.IsNullOrEmpty(model.Name))
        existing.Name = model.Name;
      if (model.YearStart.HasValue) existing.YearStart = model.YearStart;
      if (model.YearEnd.HasValue) existing.YearEnd = model.YearEnd;
      if (model.Description != null) existing.Description = model.Description;
      existing.Status = model.Status;

      existing.DateUpdated = DateTime.Now;

      return await this.UpdateAsync(existing);
    }

    public async Task<bool> DeleteAcademicYear(int id)
    {
      return await this.SoftDeleteAsync(id);
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var result = await BulkDeleteAsync(ids);
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

        if (file != null && file.Length > 0)
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

                  if (reader.GetValue(1) == null && reader.GetValue(2) == null)
                  {
                    break;
                  }

                  var myAcademicYear = new AcademicYear
                  {
                    Name = reader.GetValue(1)?.ToString() ?? "null",
                    YearStart = reader.GetValue(2) != null ? Convert.ToDateTime(reader.GetValue(2)) : null,
                    YearEnd = reader.GetValue(3) != null ? Convert.ToDateTime(reader.GetValue(3)) : null,
                    Description = reader.GetValue(4)?.ToString() ?? "null",
                    Status = reader.GetValue(5) != null && Convert.ToBoolean(reader.GetValue(5))
                  };

                  await _context.AcademicYears.AddAsync(myAcademicYear);
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
  }
}
