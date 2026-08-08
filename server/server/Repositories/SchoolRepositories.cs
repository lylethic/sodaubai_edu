using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using server.Dtos;
using server.Types.School;
using System.Text;
using server.Data;
using server.Models;
using AutoMapper;
using server.Applications.ResponseModel;
using server.Interfaces;

namespace server.Repositories
{
  public class SchoolRepositories : BaseRepository<School>, ISchool
  {
    private readonly IMapper _mapper;
    public SchoolRepositories(SoDauBaiContext context, IMapper mapper) : base(context)
    {
      this._mapper = mapper;
    }

    protected override IQueryable<School> ApplySearchFilter(IQueryable<School> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Name.Contains(searchTerm) || x.Description.Contains(searchTerm));
    }
    public async Task<School> CreateSchool(SchoolDto model)
    {
      var dto = _mapper.Map<School>(model);
      return await this.AddAsync(dto);
    }

    public async Task<School> GetSchool(int id)
    {
      return await this.GetByIdAsync(id);
    }

    public async Task<string> GetNameOfSchool(int id)
    {
      try
      {
        var getName = await _context.Schools.FirstOrDefaultAsync(x => x.Id == id);

        if (getName is null)
        {
          return "Không tìm thấy trường học";
        }

        return getName.Name;
      }
      catch (Exception ex)
      {
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<PaginatedResponse<School>> GetSchools(QueryObject request)
    {
      var result = await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);

      return new PaginatedResponse<School>
      {
        Items = result.Items,
        PageNumber = result.PageNumber,
        PageSize = result.PageSize,
        TotalCount = result.TotalCount
      };
    }

    public async Task<School> UpdateSchool(int id, SchoolDto model)
    {
      var existing = await GetByIdAsync(id);
      if (existing == null) throw new Exception("School not found");
      existing.DateUpdated = DateTime.Now;
      return await this.UpdateAsync(existing);
    }

    public async Task<bool> DeleteSchool(int id)
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
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return false;
      }
    }

    public async Task<ResponseData<string>> ImportExcelFile(IFormFile file)
    {
      try
      {
        System.Text.Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

        if (file == null || file.Length == 0)
        {
          return new ResponseData<string>(400, "Không có tệp nào được tải lên");
        }


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
                Console.WriteLine($"Name: {reader.GetValue(1)}");
                Console.WriteLine($"Address: {reader.GetValue(2)}");
                Console.WriteLine($"PhoneNumber: {reader.GetValue(3)}");
                Console.WriteLine($"SchoolType: {reader.GetValue(4)}");
                Console.WriteLine($"Description: {reader.GetValue(5)}");

                // Check if there are no more rows or empty rows
                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null && reader.GetValue(4) == null
                  && reader.GetValue(5) == null && reader.GetValue(6) == null && reader.GetValue(7) == null)
                {
                  break;
                }

                var provinceIdValue = reader.GetValue(1);
                var districtIdValue = reader.GetValue(2);

                var mySchool = new Models.School
                {
                  Name = reader.GetValue(3).ToString()! ?? "Default School Name",
                  PhoneNumber = reader.GetValue(5).ToString()!.Trim() ?? "Default Phone",
                  SchoolType = reader.GetValue(6).ToString() ?? "",
                  Description = reader.GetValue(7).ToString()?.Trim() ?? "Default Description",
                  DateUpdated = DateTime.UtcNow,
                };

                await _context.Schools.AddAsync(mySchool);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(200, "Không phát hiện sự thay đổi");
      }
      catch (Exception ex)
      {
        return new ResponseData<string>(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục.");
        throw new Exception($"Error while uploading file: {ex.Message}, Inner Exception: {ex.InnerException?.Message}");
      }
    }

    public async Task<ResponseData<string>> ExportSchoolsExcel(List<int> ids, string filePath)
    {
      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ResponseData<string>(400, "Không có id nào!");
        }

        Console.WriteLine($"ID: {string.Join(",", ids)}");

        var schools = await _context.Schools
          .Where(x => ids.Contains(x.Id))
          .ToListAsync();

        if (schools is null || !schools.Any())
        {
          return new ResponseData<string>(404, "Không tìm thấy id");
        }

        using (var workbook = new XLWorkbook())
        {
          var worksheet = workbook.Worksheets.Add("Schools");

          // Add headers: 1 row => 3 columns
          worksheet.Cell(1, 1).Value = "Mã trường học";
          worksheet.Cell(1, 2).Value = "Tên trường học";
          worksheet.Cell(1, 3).Value = "Số điện thoại";
          worksheet.Cell(1, 4).Value = "Loại trường";
          worksheet.Cell(1, 5).Value = "Mô tả";

          // Add body data: by row
          for (int i = 0; i < schools.Count; i++)
          {
            var role = schools[i];
            worksheet.Cell(i + 2, 1).Value = role.Id;
            worksheet.Cell(i + 2, 4).Value = role.Name;
            worksheet.Cell(i + 2, 6).Value = role.PhoneNumber;
            worksheet.Cell(i + 2, 7).Value = role.SchoolType;
            worksheet.Cell(i + 2, 8).Value = role.Description;
          }

          // Fit columns
          worksheet.Columns().AdjustToContents();

          // Save
          workbook.SaveAs(filePath);
        }

        return new ResponseData<string>(200, "Thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<string>(500, $"Server error: {ex.Message}");
      }
    }
  }
}
