using AutoMapper;
using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Applications.ResponseModel;
using server.Common.Exceptions;
using server.Data;
using server.Dtos;
using server.Interfaces;
using server.Models;
using System.Text;

namespace server.Repositories
{
  public class ClassificationRepositories : BaseRepository<Classification>, IClassification
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ClassificationRepositories(SoDauBaiContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<Classification> CreateAsync(ClassificationDto model)
    {
      var dto = _mapper.Map<Classification>(model);
      dto.CreatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);
      return await this.AddAsync(dto);
    }

    public async Task<Classification> GetByIDAsync(int id)
    {
      return await this.GetByIdAsync(id);
    }

    protected override IQueryable<Classification> ApplySearchFilter(IQueryable<Classification> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Name.Contains(searchTerm));
    }

    public async Task<PaginatedResponse<ExtendClassification>> GetAllAsync(QueryObject request)
    {
      var result = await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);

      return new PaginatedResponse<ExtendClassification>
      {
        Items = _mapper.Map<List<ExtendClassification>>(result.Items),
        PageNumber = result.PageNumber,
        PageSize = result.PageSize,
        TotalCount = result.TotalCount
      };
    }

    public async Task<Classification> PutAsync(int id, ClassificationDto model)
    {
      var existing = await GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy dữ liệu");

      _mapper.Map(model, existing);

      existing.DateUpdated = DateTime.UtcNow;
      if (int.TryParse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value, out int userId))
      {
        existing.UpdatedBy = userId;
      }

      return await this.UpdateAsync(existing);
    }

    public override async Task<bool> DeleteAsync(int id)
    {
      return await this.SoftDeleteAsync(id);
    }

    public override async Task<bool> BulkDeleteAsync(List<int> ids)
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

    public async Task<ResponseData<string>> ImportExcel(IFormFile file)
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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var myClassify = new Models.Classification
                {
                  Name = reader.GetValue(1).ToString() ?? "Xep loai",
                  Score = Convert.ToInt32(reader.GetValue(2)),
                };

                await _context.Classifications.AddAsync(myClassify);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(400, "Không có tệp nào được tải lên");

      }
      catch (Exception ex)
      {
        return new ResponseData<string>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }
  }
}
