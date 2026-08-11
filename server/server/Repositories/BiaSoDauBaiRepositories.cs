using AutoMapper;
using ExcelDataReader;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Common.Exceptions;
using server.Data;
using server.Dtos;
using server.Interfaces;
using server.Models;
using server.Types.BiaSoDauBai;

namespace server.Repositories
{
  public class BiaSoDauBaiRepositories : BaseRepository<BiaSoDauBai>, IBiaSoDauBai
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public BiaSoDauBaiRepositories(SoDauBaiContext context, IMapper mapper, IHttpContextAccessor httpContextAccessor) : base(context)
    {
      _mapper = mapper;
      _httpContextAccessor = httpContextAccessor;
    }

    public async Task<BiaSoDauBai> CreateBiaSoDauBai(BiaSoDauBaiDto model)
    {
      try
      {
        // Check if schoolId exists
        var schoolExists = await _context.Schools
            .AnyAsync(c => c.Id == model.SchoolId);

        if (!schoolExists)
        {
          throw new BadRequestException("Trường học không tồn tại");
        }

        // Check if academicYearId exists
        var academicYearExists = await _context.AcademicYears.AnyAsync(c => c.Id == model.AcademicyearId);

        if (!academicYearExists)
        {
          throw new BadRequestException("Năm học không tồn tại");
        }

        // Check if classId exists
        var classExists = await _context.Classes
            .AnyAsync(c => c.Id == model.ClassId);

        if (!classExists)
        {
          throw new BadRequestException("Lớp học không tồn tại");
        }

        var dto = _mapper.Map<BiaSoDauBai>(model);
        dto.CreatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);
        return await this.AddAsync(dto);
      }
      catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }
    }

    public async Task<BiaSoDauBai> GetBiaSoDauBai(int id)
    {
      var result = await GetByIdAsync(id);
      return result;
    }

    public async Task<BiaSoDauBai> UpdateBiaSoDauBai(int id, BiaSoDauBaiDto model)
    {
      var existing = await GetByIdAsync(id);
      if (existing == null) throw new NotFoundException("Không tìm thấy dữ liệu");

      existing.DateUpdated = DateTime.UtcNow;
      existing.UpdatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);
      var dto = _mapper.Map<BiaSoDauBai>(model);
      return await this.UpdateAsync(dto);
    }

    public async Task<bool> DeleteBiaSoDauBai(int id)
    {
      return await this.SoftDeleteAsync(id);
    }

    public async Task<bool> BulkDelete(List<int> ids)
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

    public async Task<BiaSoDauBaiResType> ImportExcel(IFormFile file)
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

                  // Check if there are no more rows or empty rows
                  if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null && reader.GetValue(4) == null)
                  {
                    // Stop processing when an empty row is encountered
                    break;
                  }

                  var myBiaSoDauBai = new Models.BiaSoDauBai
                  {
                    SchoolId = Convert.ToInt32(reader.GetValue(1)),
                    AcademicyearId = Convert.ToInt32(reader.GetValue(2)),
                    ClassId = Convert.ToInt32(reader.GetValue(3)),
                    Status = Convert.ToBoolean(reader.GetValue(4)),
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = null
                  };

                  await _context.BiaSoDauBais.AddAsync(myBiaSoDauBai);
                  await _context.SaveChangesAsync();
                }
              } while (reader.NextResult());
            }
          }

          return new BiaSoDauBaiResType(200, "Tải lên thành công");
        }
        return new BiaSoDauBaiResType(400, "Không có file nào được chọn để tải lên");

      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<PaginatedResponse<ExtendBiaSoDauBai>> GetBiaSoDauBais(BiaSoDauBaiSearch request)
    {
      request ??= new BiaSoDauBaiSearch();

      if (request.ClassId == 0 || request.SchoolId == 0)
      {
        throw new NotFoundException("Không tìm thấy kết quả");
      }

      var query = _context.BiaSoDauBais
          .Where(b => b.Deleted != true)
          .AsNoTracking()
          .Include(x => x.Class)
          .Include(b => b.School)
          .Include(a => a.Academicyear)
          .AsQueryable();

      if (request.SchoolId.HasValue)
      {
        query = query.Where(x => x.SchoolId == request.SchoolId.Value);
      }

      if (request.ClassId.HasValue)
      {
        query = query.Where(x => x.ClassId == request.ClassId.Value);
      }

      if (request.AcademicyearId.HasValue)
      {
        query = query.Where(x => x.AcademicyearId == request.AcademicyearId.Value);
      }

      if (request.Status.HasValue)
      {
        query = query.Where(x => x.Status == request.Status.Value);
      }

      var totalCount = await query.CountAsync();

      var items = await query
          .Skip((request.PageNumber - 1) * request.PageSize)
          .Take(request.PageSize)
          .ToListAsync();

      var mappedItems = _mapper.Map<List<ExtendBiaSoDauBai>>(items);

      return new PaginatedResponse<ExtendBiaSoDauBai>
      {
        Items = mappedItems,
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };
    }
  }
}
