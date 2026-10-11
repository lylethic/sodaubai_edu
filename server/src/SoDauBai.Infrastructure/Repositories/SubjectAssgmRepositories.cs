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
using System.Text;

namespace SoDauBai.Infrastructure.Repositories
{
  public class SubjectAssgmRepositories : BaseRepository<SubjectAssignment>, ISubject_Assgm
  {
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public SubjectAssgmRepositories(IHttpContextAccessor httpContextAccessor, SoDauBaiContext context, IMapper mapper)
      : base(context)
    {
      _mapper = mapper;
      _httpContextAccessor = httpContextAccessor;
    }

    public async Task<SubjectAssgmDto> AddAsync(SubjectAssgmDto model)
    {
      if (model is null)
        throw new BadRequestException("Vui lòng cung cấp thông tin phân công bộ môn hợp lệ");

      var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == model.TeacherId && t.Deleted == false);
      if (!teacherExists)
        throw new NotFoundException("Mã giáo viên không tồn tại");

      var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == model.SubjectId && s.Deleted == false);
      if (!subjectExists)
        throw new NotFoundException("Mã môn học không tồn tại");

      var alreadyExists = await _dbSet.AnyAsync(sa => sa.TeacherId == model.TeacherId && sa.SubjectId == model.SubjectId && sa.Deleted == false);
      if (alreadyExists)
        throw new BadRequestException("Môn học này đã được phân công cho giáo viên");

      var entity = _mapper.Map<SubjectAssgmDto, SubjectAssignment>(model);
      var result = await base.AddAsync(entity);
      return _mapper.Map<SubjectAssignment, SubjectAssgmDto>(result);
    }

    public async Task<SubjectAssgmDetail?> GetByIDAsync(int id)
    {
      var assignment = await _dbSet
        .Where(x => x.Id == id && x.Deleted == false)
        .Include(x => x.Subject)
        .Include(x => x.Teacher)
        .AsNoTracking()
        .FirstOrDefaultAsync();

      if (assignment is null)
        return null;

      return _mapper.Map<SubjectAssignment, SubjectAssgmDetail>(assignment);
    }

    public async Task<SubjectAssgmDetail?> GetTeacherBySubjectAssgm(int id)
    {
      return await GetByIDAsync(id);
    }

    protected override IQueryable<SubjectAssignment> ApplySearchFilter(IQueryable<SubjectAssignment> query, string searchTerm)
    {
      query = query.Where(x => x.Deleted == false);
      if (string.IsNullOrWhiteSpace(searchTerm))
      {
        return query;
      }
      return query.Where(x => (x.Subject != null && x.Subject.Name.Contains(searchTerm))
                           || (x.Teacher != null && x.Teacher.Fullname.Contains(searchTerm))
                           || (x.Description != null && x.Description.Contains(searchTerm)));
    }

    public async Task<PaginatedResponse<SubjectAssgmDetail>> GetSubjectAssgms(SubjectAssignmentSearch request)
    {
      var query = _dbSet
        .Where(x => x.Deleted == false)
        .Include(x => x.Subject)
        .Include(x => x.Teacher)
        .AsNoTracking()
        .AsQueryable();

      if (!string.IsNullOrWhiteSpace(request.Keyword))
      {
        query = ApplySearchFilter(query, request.Keyword);
      }

      if (request.TeacherId.HasValue)
      {
        query = query.Where(x => x.TeacherId == request.TeacherId.Value);
      }

      if (request.SubjectId.HasValue)
      {
        query = query.Where(x => x.SubjectId == request.SubjectId.Value);
      }

      var totalCount = await query.CountAsync();
      var skip = (request.PageNumber - 1) * request.PageSize;

      var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();

      return new PaginatedResponse<SubjectAssgmDetail>
      {
        Items = _mapper.Map<List<SubjectAssignment>, List<SubjectAssgmDetail>>(items),
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };
    }

    public async Task<SubjectAssgmDto> UpdateAsync(int id, SubjectAssgmDto model)
    {
      model.Id = id;
      var existing = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy phân công môn học");
      _mapper.Map(model, existing);
      existing.DateUpdated = DateTime.UtcNow;
      var updated = await base.UpdateAsync(existing);
      return _mapper.Map<SubjectAssignment, SubjectAssgmDto>(updated);
    }

    public override async Task<bool> DeleteAsync(int id)
    {
      return await base.SoftDeleteAsync(id);
    }

    public async Task<bool> BulkDelete(List<int> ids)
    {
      return await base.SoftBulkDeleteAsync(ids);
    }

    public async Task<ResponseData<string>> ImportExcel(IFormFile file)
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
                var subjectId = Convert.ToInt32(reader.GetValue(2));

                var teacherExists = await _context.Teachers.AnyAsync(t => t.Id == teacherId && t.Deleted == false);
                if (!teacherExists)
                  return new ResponseData<string>(404, $"Mã giáo viên {teacherId} không tồn tại");

                var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == subjectId && s.Deleted == false);
                if (!subjectExists)
                  return new ResponseData<string>(404, $"Mã môn học {subjectId} không tồn tại");

                var item = new SubjectAssignment
                {
                  TeacherId = teacherId,
                  SubjectId = subjectId,
                  Description = reader.GetValue(3)?.ToString() ?? string.Empty,
                  DateCreated = DateTime.UtcNow,
                  Deleted = false
                };

                await _context.SubjectAssignments.AddAsync(item);
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


