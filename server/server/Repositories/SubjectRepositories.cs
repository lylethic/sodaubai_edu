using AutoMapper;
using ExcelDataReader;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Common.Exceptions;
using server.Data;
using server.Dtos;
using server.Interfaces;
using server.Models;
using System.Text;


namespace server.Repositories
{
  public class SubjectRepositories : BaseRepository<Subject>, ISubject
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SubjectRepositories(IHttpContextAccessor httpContextAccessor, SoDauBaiContext context, IMapper mapper) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<Subject> AddAsync(SubjectDto model)
    {
      if (model is null)
        throw new BadRequestException("Vui lòng cung cấp thông tin môn học hợp lệ");

      var result = _context.Subjects.FirstOrDefaultAsync(x => x.Id == model.GradeId && x.Deleted == false) ?? throw new NotFoundException("Không tìm thấy khối học");
      var dto = _mapper.Map<SubjectDto, Subject>(model);
      return await base.AddAsync(dto);
    }

    public async Task<Subject> GetByIDAsync(int id)
    {
      var result = await _dbSet.Where(x => x.Id == id && x.Deleted == false).Include(x => x.Grade).FirstOrDefaultAsync();
      return result;
    }

    protected override IQueryable<Subject> ApplySearchFilter(IQueryable<Subject> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Grade.Name.Contains(searchTerm) || (x.Description != null && x.Description.Contains(searchTerm)));
    }

    public async Task<PaginatedResponse<ExtendSubject>> GetSubjects(SubjectSearch request)
    {
      var query = _dbSet.Where(x => x.Deleted == false).Include(x => x.Grade).AsNoTracking().AsQueryable();
      if (request.GradeId.HasValue)
      {
        query = query.Where(x => x.GradeId == request.GradeId);
      }
      var totalCount = await query.CountAsync();
      var skip = (request.PageNumber - 1) * request.PageSize;

      var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();
      return new PaginatedResponse<ExtendSubject>
      {
        Items = _mapper.Map<List<Subject>, List<ExtendSubject>>(items),
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };
    }

    public async Task<Subject> UpdateAsync(int id, SubjectDto model)
    {
      model.Id = id;
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy dữ liệu");
      _mapper.Map(model, existing);
      existing.UpdatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);
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
                && reader.GetValue(3) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var gradeId = Convert.ToInt16(reader.GetValue(1));
                var gradeExists = await _context.Grades.AnyAsync(g => g.Id == gradeId);

                if (!gradeExists)
                  return new ResponseData<string>(404, $"Mã khối học {gradeId} không tồn tại");

                var mySubjects = new Models.Subject
                {
                  GradeId = gradeId,
                  Name = reader.GetValue(2).ToString() ?? "null",
                  Status = Convert.ToBoolean(reader.GetValue(3))
                };
                await _context.Subjects.AddAsync(mySubjects);
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
        return new ResponseData<string>(500, "Có lỗi xảy ra. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }
  }
}
