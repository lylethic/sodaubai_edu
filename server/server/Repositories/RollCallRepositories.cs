using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;
using server.Types.RollCall;

namespace server.Repositories
{
  public class RollCallRepositories : IRollCall
  {
    private readonly SoDauBaiContext _context;

    public RollCallRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<RollCallResType> Create(RollCallDto model, List<RollCallDetailDto>? absenceDtos)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        if (model is null)
        {
          return new RollCallResType(400, "Vui lòng cung cấp thông tin điểm danh!");
        }

        // Ensure absenceDtos is not null
        absenceDtos ??= new List<RollCallDetailDto>();

        var newRollCall = new RollCall
        {
          ClassId = model.ClassId,
          WeekId = model.WeekId,
          DayOfTheWeek = model.DayOfTheWeek,
          DateAt = model.DateAt,
          DateCreated = DateTime.UtcNow,
          DateUpdated = null,
          NumberOfAttendants = model.NumberOfAttendants,
        };

        await _context.RollCalls.AddAsync(newRollCall);
        await _context.SaveChangesAsync();

        if (absenceDtos.Any()) // Only add absence details if there are absentees
        {
          foreach (var absenceDto in absenceDtos)
          {
            var newAbsence = new RollCallDetail
            {
              RollCallId = newRollCall.RollCallId,
              Description = absenceDto.Description,
              StudentId = absenceDto.StudentId,
              IsExcused = absenceDto.IsExecute,
            };
            await _context.RollCallDetails.AddAsync(newAbsence);
          }
          await _context.SaveChangesAsync();
        }

        await transaction.CommitAsync();

        return new RollCallResType(200, "Tạo điểm danh thành công.", newRollCall);
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new RollCallResType(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<RollCallResType> BulkDelete(List<int> rollCallIds)
    {
      try
      {
        if (rollCallIds is null)
        {
          return new RollCallResType(400, "Dữ liệu không được cung cấp.");
        }

        var rollCalls = await _context.RollCalls
         .Include(x => x.RollCallDetails)  // Include Absences to delete them as well
         .Where(x => rollCallIds.Contains(x.RollCallId))
         .ToListAsync();

        if (rollCalls == null)
        {
          return new RollCallResType(404, "Không tìm thấy dữ liệu.");
        }

        var absencesToDelete = rollCalls.SelectMany(x => x.RollCallDetails).ToList();
        _context.RollCallDetails.RemoveRange(absencesToDelete);

        _context.RollCalls.RemoveRange(rollCalls);

        await _context.SaveChangesAsync();

        return new RollCallResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new RollCallResType(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<RollCallResType> Delete(int rollCallId)
    {
      try
      {
        if (rollCallId == 0)
        {
          return new RollCallResType(400, "Dữ liệu không được cung cấp.");
        }

        var rollCall = await _context.RollCalls
         .Include(x => x.RollCallDetails)  // Include Absences to delete them as well
         .FirstOrDefaultAsync(x => x.RollCallId == rollCallId);

        if (rollCall == null)
        {
          return new RollCallResType(404, "Không tìm thấy dữ liệu.");
        }
        _context.RollCallDetails.RemoveRange(rollCall.RollCallDetails);

        _context.RollCalls.Remove(rollCall);

        await _context.SaveChangesAsync();

        return new RollCallResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new RollCallResType(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<RollCallResType> Update(int rollCallId, RollCallDto model)
    {
      try
      {
        // Find the RollCall to update
        var rollCall = await _context.RollCalls
            .FirstOrDefaultAsync(x => x.RollCallId == rollCallId);

        if (rollCall == null)
        {
          return new RollCallResType(400, "Dữ liệu không được cung cấp.");
        }

        // Update properties
        rollCall.ClassId = model.ClassId;
        rollCall.WeekId = model.WeekId;
        rollCall.DayOfTheWeek = model.DayOfTheWeek;
        rollCall.DateAt = model.DateAt;
        rollCall.NumberOfAttendants = model.NumberOfAttendants;
        rollCall.DateUpdated = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new RollCallResType(200, "Cập nhật thành công", rollCall);
      }
      catch (Exception ex)
      {
        return new RollCallResType(500, "Có lỗi cảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<RollCallResType> RollCall(int rollCallId)
    {
      try
      {
        var rollCall = await _context.RollCalls
          .Where(x => x.RollCallId == rollCallId)
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (rollCall is null) return new RollCallResType(404, "Không tìm thấy dữ liệu hoặc dữ liệu không tồn tại");

        TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

        rollCall.DateAt = rollCall.DateAt.HasValue
          ? rollCall.DateAt.Value.ToLocalTime()
          : null;

        rollCall.DateCreated = rollCall.DateCreated.HasValue
          ? rollCall.DateCreated.Value.ToLocalTime()
          : null;

        rollCall.DateUpdated = rollCall.DateUpdated.HasValue
          ? rollCall.DateUpdated.Value.ToLocalTime()
          : null;

        return new RollCallResType(200, $"Thành công", rollCall);
      }
      catch (Exception ex)
      {
        return new RollCallResType(500, $"Đang xảy ra lỗi tại server... {ex.Message}");
        throw new Exception(ex.Message);
      }
    }

    public async Task<RollCallResType> RollCalls(int weekId, int classId)
    {
      try
      {
        var rollCalls = await _context.RollCalls
          .Where(x => x.WeekId == weekId && x.ClassId == classId)
          .Include(x => x.RollCallDetails)
          .ThenInclude(x => x.Student)
          .AsNoTracking()
          .ToListAsync();

        TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

        rollCalls.ForEach(x =>
        {
          if (x.DateAt.HasValue) x.DateAt = TimeZoneInfo.ConvertTimeFromUtc(x.DateAt.Value, vietnamTimeZone);
          if (x.DateCreated.HasValue) x.DateCreated = TimeZoneInfo.ConvertTimeFromUtc(x.DateCreated.Value, vietnamTimeZone);
          if (x.DateUpdated.HasValue) x.DateUpdated = TimeZoneInfo.ConvertTimeFromUtc(x.DateUpdated.Value, vietnamTimeZone);
        });

        return new RollCallResType(200, $"Thành công", rollCalls);
      }
      catch (Exception ex)
      {
        return new RollCallResType(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<RollCallResType> RollCalls(int weekId, int? classId)
    {
      try
      {
        var queryObject = from rollcall in _context.RollCalls
                          join w in _context.Weeks on rollcall.WeekId equals w.WeekId into weekGroup
                          from w in weekGroup.DefaultIfEmpty()
                          join cl in _context.Classes on rollcall.ClassId equals cl.ClassId into classGroup
                          from cl in classGroup.DefaultIfEmpty()
                          where rollcall.WeekId == weekId && (classId == null || rollcall.ClassId == classId)
                          select new RollCallRes()
                          {
                            RollCallId = rollcall.RollCallId,
                            WeekId = rollcall.WeekId,
                            WeekName = w.WeekName,
                            ClassId = rollcall.ClassId,
                            ClassName = cl.ClassName,
                            DayOfTheWeek = rollcall.DayOfTheWeek,
                            DateAt = rollcall.DateAt,
                            DateCreated = rollcall.DateCreated,
                            DateUpdated = rollcall.DateUpdated,
                            NumberOfAttendants = rollcall.NumberOfAttendants ?? 0
                          };

        var rollCalls = await queryObject
          .AsNoTracking()
          .ToListAsync();

        if (rollCalls is null || rollCalls.Count == 0)
        {
          return new RollCallResType(200, "Không tìm thấy dữ liệu");
        }

        return new RollCallResType(200, $"Thành công", rollCalls);
      }
      catch (Exception ex)
      {
        return new RollCallResType(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public Task<RollCallResType> Export(int weekId, int classId)
    {
      throw new NotImplementedException();
    }

    public Task<RollCallResType> Import(int weekId, int classId)
    {
      throw new NotImplementedException();
    }

    public async Task<RollCallResType> Update(int rollCallId, RollCallDto model, List<RollCallDetailDto> absenceDtos)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        // Check if RollCall exists
        var existingRollCall = await _context.RollCalls.FindAsync(rollCallId);
        if (existingRollCall == null)
        {
          return new RollCallResType(404, "Không tìm thấy điểm danh!");
        }

        // Update RollCall fields
        existingRollCall.ClassId = model.ClassId;
        existingRollCall.WeekId = model.WeekId;
        existingRollCall.DayOfTheWeek = model.DayOfTheWeek;
        existingRollCall.DateAt = model.DateAt;
        existingRollCall.NumberOfAttendants = model.NumberOfAttendants;
        existingRollCall.DateUpdated = DateTime.UtcNow;

        _context.RollCalls.Update(existingRollCall);
        await _context.SaveChangesAsync();

        // Get existing absences for this roll call
        var existingAbsences = _context.RollCallDetails.Where(d => d.RollCallId == rollCallId).ToList();

        // Remove absences that are not in the new list
        var absencesToRemove = existingAbsences.Where(e => !absenceDtos.Any(a => a.StudentId == e.StudentId)).ToList();
        _context.RollCallDetails.RemoveRange(absencesToRemove);

        // Update or add new absences
        foreach (var absenceDto in absenceDtos)
        {
          var existingAbsence = existingAbsences.FirstOrDefault(e => e.StudentId == absenceDto.StudentId);

          if (existingAbsence != null)
          {
            // Update existing absence
            existingAbsence.Description = absenceDto.Description;
            existingAbsence.IsExcused = absenceDto.IsExecute;
            _context.RollCallDetails.Update(existingAbsence);
          }
          else
          {
            // Add new absence
            var newAbsence = new RollCallDetail
            {
              RollCallId = rollCallId,
              StudentId = absenceDto.StudentId,
              Description = absenceDto.Description,
              IsExcused = absenceDto.IsExecute
            };
            await _context.RollCallDetails.AddAsync(newAbsence);
          }
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return new RollCallResType(200, "Cập nhật điểm danh thành công.", existingRollCall);
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new RollCallResType(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

  }
}
