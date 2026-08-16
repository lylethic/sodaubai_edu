using AutoMapper;
using Azure.Core;
using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Common.Exceptions;
using server.Data;
using server.Dtos;
using server.Interfaces;
using server.Models;
using server.Types.ChiTietSoDauBai;
using server.Types.Week;
using System.Text;

namespace server.Repositories
{
  public class ChiTietSoDauBaiRepositories : BaseRepository<ChiTietSoDauBai>, IChiTietSoDauBai
  {
    private IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ChiTietSoDauBaiRepositories(SoDauBaiContext context, IHttpContextAccessor httpContextAccessor, IMapper mapper) : base(context)
    {
      this._mapper = mapper;
      this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<ChiTietSoDauBai> CreateChiTietSoDauBai(ChiTietSoDauBaiDto model)
    {
      try
      {
        var existingBia = await _context.BiaSoDauBais.AnyAsync(x => x.Id == model.BiaSoDauBaiId);
        if (!existingBia) throw new NotFoundException("Không tìm thấy id bìa sổ đầu bài");

        var existingSemester = await _context.Semesters.AnyAsync(x => x.Id == model.SemesterId);
        if (!existingSemester) throw new NotFoundException("Không tìm thấy id học kỳ");

        var existingWeek = await _context.Weeks.AnyAsync(x => x.Id == model.WeekId);
        if (!existingWeek) throw new NotFoundException("Không tìm thấy id tuần học");

        var existingSubject = await _context.Subjects.AnyAsync(x => x.Id == model.SubjectId);
        if (!existingSubject) throw new NotFoundException("Không tìm thấy id môn học");

        var existingXepLoai = await _context.Classifications.AnyAsync(x => x.Id == model.ClassificationId);
        if (!existingXepLoai) throw new NotFoundException("Không tìm thấy id xếp loại");

        var entity = _mapper.Map<ChiTietSoDauBai>(model);
        return await this.AddAsync(entity);
      }
      catch (Exception ex)
      {
        throw new Exception(ex.Message);
      }
    }

    public async Task<ChiTietSoDauBai> GetChiTietSoDauBai(int id)
    {
      var result = await this.GetByIdAsync(id) ??
        throw new NotFoundException("Không tìm thấy dữ liệu");
      return result;
    }


    public async Task<PaginatedResponse<ExtendChiTietSoDauBai>> GetChiTietSoDauBais(ChiTietSoDauBaiSearch request)
    {
      var query = _context.ChiTietSoDauBais
          .Where(x => x.Deleted != true)
          .AsNoTracking()
          .Include(c => c.BiaSoDauBai)
          .Include(c => c.Semester)
          .Include(c => c.Week)
          .Include(c => c.Subject)
          .Include(c => c.Classification)
          .Include(c => c.CreatedByNavigation)
          .AsQueryable();
      if (request.BiaSoDauBaiId.HasValue)
      {
        query = query.Where(x => x.BiaSoDauBaiId == request.BiaSoDauBaiId.Value);
      }
      if (request.SemesterId.HasValue)
      {
        query = query.Where(x => x.SemesterId == request.SemesterId.Value);
      }
      if (request.WeekId.HasValue)
      {
        query = query.Where(x => x.WeekId == request.WeekId.Value);
      }
      if (request.ClassificationId.HasValue)
      {
        query = query.Where(x => x.ClassificationId == request.ClassificationId.Value);
      }
      if (request.SubjectId.HasValue)
      {
        query = query.Where(x => x.SubjectId == request.SubjectId.Value);
      }
      var totalCount = await query.CountAsync();
      var items = await query
          .Skip((request.PageNumber - 1) * request.PageSize)
          .Take(request.PageSize)
          .ToListAsync();
      var mappedItems = _mapper.Map<List<ExtendChiTietSoDauBai>>(items);
      return new PaginatedResponse<ExtendChiTietSoDauBai>()
      {
        Items = mappedItems,
        TotalCount = totalCount,
        PageNumber = request.PageNumber,
        PageSize = request.PageSize
      };

    }

    public async Task<ChiTietSoDauBai> UpdateChiTietSoDauBai(int id, ChiTietSoDauBaiDto model)
    {
      var existing = await GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy dữ liệu");
      _mapper.Map(model, existing);
      existing.DateUpdated = DateTime.UtcNow;
      existing.UpdatedBy = int.Parse(_httpContextAccessor.HttpContext?.User.FindFirst("UserId")?.Value!);
      return await this.UpdateAsync(existing);
    }


    public async Task<bool> DeleteChiTietSoDauBai(int id)
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

    public async Task<Types.ChiTietSoDauBai.ChiTietSoDauBaiResType> ImportExcel(IFormFile file)
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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null
                  && reader.GetValue(4) == null && reader.GetValue(5) == null && reader.GetValue(6) == null
                  && reader.GetValue(7) == null && reader.GetValue(8) == null && reader.GetValue(9) == null
                  && reader.GetValue(10) == null && reader.GetValue(11) == null && reader.GetValue(12) == null
                  && reader.GetValue(13) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var myDetails = new Models.ChiTietSoDauBai
                {
                  BiaSoDauBaiId = Convert.ToInt32(reader.GetValue(1) ?? 0),
                  SemesterId = Convert.ToInt32(reader.GetValue(2) ?? 0),
                  WeekId = Convert.ToInt32(reader.GetValue(3) ?? 0),
                  SubjectId = Convert.ToInt32(reader.GetValue(4) ?? 0),
                  ClassificationId = Convert.ToInt32(reader.GetValue(5) ?? 0),
                  DaysOfTheWeek = reader.GetValue(6)?.ToString() ?? "Thứ",
                  Time = Convert.ToDateTime(reader.GetValue(7) ?? DateTime.MinValue),
                  Session = reader.GetValue(8)?.ToString() ?? "Buổi ",
                  Period = Convert.ToInt32(reader.GetValue(9) ?? 0),
                  LessonContent = reader.GetValue(10)?.ToString() ?? "Nội dung bài học",
                  Attend = Convert.ToInt32(reader.GetValue(11) ?? 0),
                  Note = reader.GetValue(12)?.ToString() ?? "Ghi chú",
                  CreatedBy = Convert.ToInt32(reader.GetValue(13) ?? 0),
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null
                };

                await _context.ChiTietSoDauBais.AddAsync(myDetails);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new Types.ChiTietSoDauBai.ChiTietSoDauBaiResType(200, "Thêm danh sách bằng excel thành công");
        }

        return new Types.ChiTietSoDauBai.ChiTietSoDauBaiResType(400, "Không có file nào được tải lên");
      }
      catch (Exception ex)
      {
        return new Types.ChiTietSoDauBai.ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<Types.ChiTietSoDauBai.ChiTietSoDauBaiResType> ExportChiTietSoDauBaiToExcel(int weekId, int classId, string filePath)
    {
      try
      {
        // Fetch records filtered by weekId
        var chiTietSoDauBais = await (from chitiet in _context.ChiTietSoDauBais
                                      join week in _context.Weeks on chitiet.WeekId equals week.Id into weekGroup
                                      from week in weekGroup.DefaultIfEmpty()
                                      join bia in _context.BiaSoDauBais on chitiet.BiaSoDauBaiId equals bia.Id into biaGroup
                                      from bia in biaGroup.DefaultIfEmpty()
                                      join semester in _context.Semesters on chitiet.SemesterId equals semester.Id into semesterGroup
                                      from semester in semesterGroup.DefaultIfEmpty()
                                      join subject in _context.Subjects on chitiet.SubjectId equals subject.Id into subjectGroup
                                      from subject in subjectGroup.DefaultIfEmpty()
                                      join xepLoai in _context.Classifications on chitiet.ClassificationId equals xepLoai.Id into xepLoaiGroup
                                      from xepLoai in xepLoaiGroup.DefaultIfEmpty()
                                      where chitiet.WeekId == weekId && bia.ClassId == classId
                                      select new
                                      {
                                        chitiet.Id,
                                        chitiet.BiaSoDauBaiId,
                                        chitiet.SemesterId,
                                        chitiet.WeekId,
                                        chitiet.SubjectId,
                                        chitiet.ClassificationId,
                                        chitiet.DaysOfTheWeek,
                                        chitiet.Time,
                                        chitiet.Session,
                                        chitiet.Period,
                                        chitiet.LessonContent,
                                        chitiet.Attend,
                                        chitiet.Note,
                                        chitiet.CreatedBy,
                                        chitiet.DateCreated,
                                        chitiet.DateUpdated,
                                        HocKy = semester.Name,
                                        TenTuanHoc = week.Name,
                                        MonHoc = subject.Name,
                                        TenLop = bia.Class.Name,
                                        XepLoai = xepLoai.Name
                                      }).ToListAsync();

        if (chiTietSoDauBais == null || !chiTietSoDauBais.Any())
        {
          return new Types.ChiTietSoDauBai.ChiTietSoDauBaiResType(404, "Không có kết quả cho tuần được yêu cầu.");
        }

        using (var workbook = new XLWorkbook())
        {
          var worksheet = workbook.Worksheets.Add("ChiTietSoDauBai");

          // Add headers
          worksheet.Cell(1, 1).Value = "Mã chi tiết sổ đầu bài";
          worksheet.Cell(1, 2).Value = "Lớp";
          worksheet.Cell(1, 3).Value = "Học kỳ";
          worksheet.Cell(1, 4).Value = "Tuần học";
          worksheet.Cell(1, 5).Value = "Môn học";
          worksheet.Cell(1, 6).Value = "Xếp loại";
          worksheet.Cell(1, 7).Value = "Ngày trong tuần";
          worksheet.Cell(1, 8).Value = "Thời gian";
          worksheet.Cell(1, 9).Value = "Buổi học";
          worksheet.Cell(1, 10).Value = "Tiết học";
          worksheet.Cell(1, 11).Value = "Nội dung bài học";
          worksheet.Cell(1, 12).Value = "Sĩ số";
          worksheet.Cell(1, 13).Value = "Ghi chú";
          worksheet.Cell(1, 14).Value = "Ngày tạo";
          worksheet.Cell(1, 15).Value = "Ngày cập nhật";

          // Add data rows
          for (int i = 0; i < chiTietSoDauBais.Count; i++)
          {
            var record = chiTietSoDauBais[i];
            worksheet.Cell(i + 2, 1).Value = record.Id;
            worksheet.Cell(i + 2, 2).Value = record.TenLop;
            worksheet.Cell(i + 2, 3).Value = record.HocKy;
            worksheet.Cell(i + 2, 4).Value = record.TenTuanHoc;
            worksheet.Cell(i + 2, 5).Value = record.MonHoc;
            worksheet.Cell(i + 2, 6).Value = record.XepLoai;
            worksheet.Cell(i + 2, 7).Value = record.DaysOfTheWeek;
            worksheet.Cell(i + 2, 8).Value = record.Time;
            worksheet.Cell(i + 2, 9).Value = record.Session;
            worksheet.Cell(i + 2, 10).Value = record.Period;
            worksheet.Cell(i + 2, 11).Value = record.LessonContent;
            worksheet.Cell(i + 2, 12).Value = record.Attend;
            worksheet.Cell(i + 2, 13).Value = record.Note;
            worksheet.Cell(i + 2, 14).Value = record.DateCreated;
            worksheet.Cell(i + 2, 15).Value = record.DateUpdated;
          }

          // Adjust column widths
          worksheet.Columns().AdjustToContents();

          // Save the Excel file
          workbook.SaveAs(filePath);
        }

        return new Types.ChiTietSoDauBai.ChiTietSoDauBaiResType(200, "Xuất file Excel thành công.");
      }
      catch (Exception ex)
      {
        return new Types.ChiTietSoDauBai.ChiTietSoDauBaiResType(500, $"Lỗi máy chủ: {ex.Message}");
      }
    }

  }
}
