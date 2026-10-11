using AutoMapper;
using ExcelDataReader;
using Microsoft.EntityFrameworkCore;
using SoDauBai.Application.Common.Models;
using SoDauBai.Application.Common.Exceptions;
using SoDauBai.Infrastructure.Data;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Domain.Entities;
using System.Text;

namespace SoDauBai.Infrastructure.Repositories
{
  public class SemesterRepositories : BaseRepository<Semester>, ISemester
  {
    private readonly IMapper _mapper;
    private readonly ISessionUser _session;
    public SemesterRepositories(SoDauBaiContext context, IMapper mapper, ISessionUser session) : base(context)
    {
      this._mapper = mapper;
      this._session = session;
    }

    public async Task<Semester> AddAsync(SemesterDto model)
    {
      var dto = _mapper.Map<SemesterDto, Semester>(model);
      var result = await base.AddAsync(dto);
      return result;
    }

    public override async Task<bool> DeleteAsync(int id)
    {
      return await base.SoftDeleteAsync(id);
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      return await base.BulkDeleteAsync(ids);
    }

    public async Task<ExtendSemester> GetByIDAsync(int id)
    {
      var result = await base.GetByIdAsync(id);
      return _mapper.Map<ExtendSemester>(result);
    }

    protected override IQueryable<Semester> ApplySearchFilter(IQueryable<Semester> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => x.Name.Contains(searchTerm) || x.Description.Contains(searchTerm));
    }

    public async Task<PaginatedResponse<ExtendSemester>> GetAllAsync(QueryObject request)
    {
      var result = await base.GetOffsetPagedAsync(
        request.PageSize,
        (request.PageNumber - 1) * request.PageSize,
        request.Keyword,
        request.Status,
        include: q => q.Include(s => s.AcademicYear));
      return new PaginatedResponse<ExtendSemester>
      {
        Items = _mapper.Map<List<ExtendSemester>>(result.Items),
        TotalCount = result.TotalCount,
        PageNumber = result.PageNumber,
        PageSize = result.PageSize
      };
    }

    public async Task<Semester> UpdateAsync(int id, SemesterDto model)
    {
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm th?y h?c k?");
      _mapper.Map(model, existing);
      existing.DateUpdated = DateTime.UtcNow;
      existing.UpdatedBy = _session.UserId;
      return await base.UpdateAsync(existing);
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
                && reader.GetValue(3) == null && reader.GetValue(4) == null
                && reader.GetValue(5) == null && reader.GetValue(6) == null)
                {
                  break;
                }

                var mySemester = new Semester
                {
                  AcademicYearId = Convert.ToInt16(reader.GetValue(1)),
                  Name = reader.GetValue(2).ToString() ?? "_",
                  DateStart = Convert.ToDateTime(reader.GetValue(3)),
                  DateEnd = Convert.ToDateTime(reader.GetValue(4)),
                  Description = reader.GetValue(5).ToString(),
                  Status = Convert.ToBoolean(reader.GetValue(6))
                };

                await _context.Semesters.AddAsync(mySemester);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Nh?p danh sách thành công");
        }
        return new ResponseData<string>(400, "Không có t?p nào du?c t?i lên");
      }
      catch (Exception ex)
      {
        return new ResponseData<string>(500, $"Server error: {ex.Message}");
      }
    }

  }
}



