using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Types.Week;
using System.Globalization;
using System.Text;

namespace server.Repositories
{
  public class WeekRepositories : IWeek
  {
    private readonly SoDauBaiContext _context;
    private readonly ILogger<WeekRepositories> _logger;

    public WeekRepositories(SoDauBaiContext context, ILogger<WeekRepositories> logger)
    {
      this._context = context ?? throw new ArgumentNullException(nameof(context));
      this._logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    public async Task<ResponseData<WeekDto>> CreateWeek(WeekDto model)
    {
      try
      {
        var find = "SELECT * FROM Week WHERE WeekId = @id";

        var existingWeek = await _context.Weeks
          .FromSqlRaw(find, new SqlParameter("@id", model.WeekId))
          .FirstOrDefaultAsync();

        if (existingWeek is not null)
        {
          return new ResponseData<WeekDto>(409, "Tuần học đã tồn tại");
        }

        var findSemester = "SELECT * FROM Semester WHERE SemesterId = @id";

        var semester = await _context.Semesters
          .FromSqlRaw(findSemester, new SqlParameter("@id", model.SemesterId))
          .FirstOrDefaultAsync();

        if (semester is null)
        {
          return new ResponseData<WeekDto>(404, "Học kỳ không tồn tại");
        }

        var sqlInsert = @"INSERT INTO Week (SemesterId, WeekName, WeekStart, WeekEnd, Status) 
                          VALUES (@SemesterId, @WeekName, @WeekStart, @WeekEnd, @Status);
                          SELECT CAST(SCOPE_IDENTITY() as int);";


        var insert = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
          new SqlParameter("@SemesterId", model.SemesterId),
          new SqlParameter("@WeekName", model.WeekName),
          new SqlParameter("@WeekStart", model.WeekStart),
          new SqlParameter("@WeekEnd", model.WeekEnd),
          new SqlParameter("@status", model.Status)
        );

        var result = new WeekDto
        {
          WeekId = insert,
          SemesterId = model.SemesterId,
          WeekName = model.WeekName,
          WeekStart = model.WeekStart,
          WeekEnd = model.WeekEnd,
          Status = model.Status,
        };

        return new ResponseData<WeekDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<WeekDto>(200, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<WeekData>> GetWeek(int id)
    {
      try
      {
        if (id <= 0)
        {
          return new ResponseData<WeekData>(400, "Vui lòng cung cấp mã tuần học");
        }

        var find = @"SELECT w.*, a.semesterName, a.dateStart, a.dateEnd
                    FROM WEEK as w 
                    INNER JOIN Semester as a ON w.semesterId = a.semesterId 
                    WHERE W.weekId = @id";

        var week = await _context.Weeks
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .AsNoTracking()
          .Select(static x => new
          {
            x.WeekId,
            x.WeekName,
            x.WeekStart,
            x.WeekEnd,
            x.Status,
            x.SemesterId,
            SemesterName = x.Semester.SemesterName,
            DateStart = x.Semester.DateStart,
            DateEnd = x.Semester.DateEnd,
          })
          .FirstOrDefaultAsync();

        if (week is null)
        {
          return new ResponseData<WeekData>(404, "Tuần học không tồn tại");
        }

        var result = new WeekData
        {
          WeekId = id,
          WeekName = week.WeekName,
          WeekStart = week.WeekStart?.ToString("dd/MM/yyyy"),
          WeekEnd = week.WeekEnd?.ToString("dd/MM/yyyy"),
          Status = week.Status,
          SemesterId = week.SemesterId,
          SemesterName = week.SemesterName,
          DateStart = week.DateStart?.ToString("dd/MM/yyyy"),
          DateEnd = week.DateEnd?.ToString("dd/MM/yyyy")
        };

        return new ResponseData<WeekData>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<WeekData>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<WeekDto>> GetWeekToUpdate(int id)
    {
      try
      {
        if (id <= 0)
        {
          return new ResponseData<WeekDto>(400, "Vui lòng cung cấp mã tuần học");
        }

        var find = @"SELECT w.*, a.semesterName, a.dateStart, a.dateEnd
                    FROM WEEK as w 
                    INNER JOIN Semester as a ON w.semesterId = a.semesterId 
                    WHERE W.weekId = @id";

        var week = await _context.Weeks
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .AsNoTracking()
          .Select(static x => new
          {
            x.WeekId,
            x.SemesterId,
            x.WeekName,
            x.WeekStart,
            x.WeekEnd,
            x.Status,
          })
          .FirstOrDefaultAsync();

        if (week is null)
        {
          return new ResponseData<WeekDto>(404, "Tuần học không tồn tại");
        }

        var result = new WeekDto
        {
          WeekId = id,
          SemesterId = week.SemesterId,
          WeekName = week.WeekName,
          WeekStart = week.WeekStart,
          WeekEnd = week.WeekEnd,
          Status = week.Status,
        };

        return new ResponseData<WeekDto>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<WeekDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<WeekData>>> GetWeeks()
    {
      try
      {
        var weekQuery = from week in _context.Weeks
                        join hocKy in _context.Semesters on week.SemesterId equals hocKy.SemesterId into hocKyGroup
                        from hocKy in hocKyGroup.DefaultIfEmpty()
                        select new
                        {
                          week.WeekId,
                          week.SemesterId,
                          week.WeekName,
                          week.WeekStart,
                          week.WeekEnd,
                          week.Status,
                          hocKy.SemesterName,
                          hocKy.DateStart,
                          hocKy.DateEnd,
                        };

        var weeks = await weekQuery
          .AsNoTracking()
          .OrderByDescending(x => x.WeekStart)
          .ToListAsync();

        var result = weeks.Select(week => new WeekData
        {
          WeekId = week.WeekId,
          WeekName = week.WeekName,
          WeekStart = week.WeekStart?.ToString("dd/MM/yyyy"),
          WeekEnd = week.WeekEnd?.ToString("dd/MM/yyyy"),
          Status = week.Status,
          SemesterId = week.SemesterId,
          SemesterName = week.SemesterName,
          DateStart = week.DateStart?.ToString("dd/MM/yyyy"),
          DateEnd = week.DateEnd?.ToString("dd/MM/yyyy")
        }).ToList();

        return new ResponseData<List<WeekData>>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<List<WeekData>>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<List<WeekDto>>> GetWeeksBySemester(int semesterId)
    {
      try
      {
        var query = @"SELECT * FROM Week
                      WHERE SEMESTERID = @semesterId
                      ORDER BY WeekId";

        var weeks = await _context.Weeks
          .FromSqlRaw(query, new SqlParameter("@semesterId", semesterId))
          .AsNoTracking()
          .ToListAsync() ?? throw new Exception("Empty");

        var result = weeks.Select(x => new WeekDto
        {
          WeekId = x.WeekId,
          SemesterId = x.SemesterId,
          WeekName = x.WeekName,
          WeekStart = x.WeekStart,
          WeekEnd = x.WeekEnd,
        }).ToList();

        return new ResponseData<List<WeekDto>>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.Message);
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> ImportExcelFile(IFormFile file)
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

                // Log each value before processing
                Console.WriteLine($"SemesterId: {reader.GetValue(1)}");
                Console.WriteLine($"WeekName: {reader.GetValue(2)}");
                Console.WriteLine($"WeekStart: {reader.GetValue(3)}");
                Console.WriteLine($"WeekEnd: {reader.GetValue(4)}");
                Console.WriteLine($"Status: {reader.GetValue(5)}");

                // Check if there are no more rows or empty rows
                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null && reader.GetValue(4) == null && reader.GetValue(5) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var myWeek = new Models.Week
                {
                  SemesterId = reader.GetValue(1) != null ? Convert.ToInt16(reader.GetValue(1)) : 0,
                  WeekName = reader.GetValue(2)?.ToString() ?? "null",
                  WeekStart = Convert.ToDateTime(reader.GetValue(3)),
                  WeekEnd = Convert.ToDateTime(reader.GetValue(4)),
                  Status = reader.GetValue(5) != null && Convert.ToBoolean(reader.GetValue(5))
                };


                await _context.Weeks.AddAsync(myWeek);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ResponseData<string>(200, "Tải lên thành công");
        }
        return new ResponseData<string>(400, "Không có tệp nào được tải lên");
      }
      catch (DbUpdateException ex)
      {
        throw new Exception($"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<ResponseData<WeekDto>> UpdateWeek(int id, WeekDto model)
    {
      try
      {
        var findWeek = "SELECT * FROM WEEK WHERE WEEKID = @id";

        var existingWeek = await _context.Weeks
          .FromSqlRaw(findWeek, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (existingWeek is null)
        {
          return new ResponseData<WeekDto>(404, "Tuần học không tồn tại");
        }

        bool hasChanges = false;

        var parameters = new List<SqlParameter>();
        var queryBuilder = new StringBuilder("UPDATE Week SET ");

        if (model.SemesterId != 0 && model.SemesterId != existingWeek.SemesterId)
        {
          queryBuilder.Append("SemesterId = @SemesterId, ");
          parameters.Add(new SqlParameter("@SemesterId", model.SemesterId));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.WeekName) && model.WeekName != existingWeek.WeekName)
        {
          queryBuilder.Append("WeekName = @WeekName, ");
          parameters.Add(new SqlParameter("@WeekName", model.WeekName));
          hasChanges = true;
        }

        if (model.WeekStart != default && model.WeekStart != existingWeek.WeekStart)
        {
          queryBuilder.Append("WeekStart = @WeekStart, ");
          parameters.Add(new SqlParameter("@WeekStart", model.WeekStart));
          hasChanges = true;
        }

        if (model.WeekEnd != default && model.WeekEnd != existingWeek.WeekEnd)
        {
          queryBuilder.Append("WeekEnd = @WeekEnd, ");
          parameters.Add(new SqlParameter("@WeekEnd", model.WeekEnd));
          hasChanges = true;
        }

        if (hasChanges)
        {
          if (queryBuilder[queryBuilder.Length - 2] == ',')
            queryBuilder.Length -= 2;

          queryBuilder.Append(" WHERE WeekId = @id");
          parameters.Add(new SqlParameter("@id", id));

          // Execute the update query
          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          return new ResponseData<WeekDto>(200, "Đã cập nhật");
        }
        else
        {
          return new ResponseData<WeekDto>(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        return new ResponseData<WeekDto>(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<ResponseData<WeekDto>> DeleteWeek(int id)
    {
      try
      {
        var query = "SELECT * FROM Week WHERE weekId = @id";

        var week = await _context.Weeks
          .FromSqlRaw(query, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (week is null)
        {
          return new ResponseData<WeekDto>(404, "Tuần học không tồn tại");
        }

        var deleteQuery = "DELETE FROM Week WHERE WeekId = @id";

        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));

        return new ResponseData<WeekDto>(200, "Đã xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<WeekDto>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ResponseData<string>> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ResponseData<string>(400, "Không có mã tuần nào được cung cấp");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM Week WHERE WeekId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ResponseData<string>(404, "Tuần học không tồn tại");
        }

        await transaction.CommitAsync();

        return new ResponseData<string>(200, "Đã xóa");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ResponseData<string>(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<WeekResType> Get7DaysInWeek(int selectedWeekId)
    {
      try
      {
        var selectedWeek = await _context.Weeks
        .AsNoTracking()
        .FirstOrDefaultAsync(x => x.WeekId == selectedWeekId);

        if (selectedWeek == null)
        {
          return new WeekResType(404, "Không tìm thấy");
        }

        var daysInWeek = new List<SevenDaysInWeek>();

        // Align `currentDate` to the nearest Monday
        var currentDate = selectedWeek.WeekStart;

        if (currentDate.HasValue) // Ensure that currentDate is not null
        {
          var dayOfWeek = (int)currentDate.Value.DayOfWeek;
          int offsetToMonday = (dayOfWeek == 0 ? -6 : 1) - dayOfWeek; // Adjust Sunday (0) to -6 for Monday alignment
          currentDate = currentDate.Value.AddDays(offsetToMonday); // Access DateTime value and add days

          for (int i = 0; i < 7; i++)
          {
            daysInWeek.Add(new SevenDaysInWeek
            {
              Day = currentDate?.ToString("dddd", new CultureInfo("vi-VN")),
              Date = currentDate?.ToString("dd/MM/yyyy")
            });

            currentDate = currentDate.Value.AddDays(1); // Add one day
          }
        }
        else
        {
          return new WeekResType(400, "WeekStart date is null");
        }

        return new WeekResType(200, "Thành công", daysInWeek);
      }
      catch (System.Exception ex)
      {
        return new WeekResType(500, $"Server error: {ex.Message}");
      }
    }

  }
}
