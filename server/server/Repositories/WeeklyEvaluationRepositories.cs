using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;

namespace server.Repositories
{
  public class WeeklyEvaluationRepositories : IWeeklyEvaluation
  {
    private readonly SoDauBaiContext _context;

    public WeeklyEvaluationRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<WeeklyEvaluation>> Create(WeeklyEvaluationDto model)
    {
      try
      {
        if (model is null)
        {
          return new ResponseData<WeeklyEvaluation>(400, "Vui lòng cung cấp dữ liệu");
        }

        var weeklyEvaluation = new WeeklyEvaluation
        {
          ClassId = model.ClassId,
          TeacherId = model.TeacherId,
          WeekId = model.WeekId,
          WeekNameEvaluation = model.WeekNameEvaluation,
          TotalScore = await GetTotalScoreByWeekId(model.WeekId),
          Description = model.Description,
          CreatedAt = DateTime.UtcNow,
          UpdatedAt = null
        };

        _context.WeeklyEvaluations.Add(weeklyEvaluation);
        await _context.SaveChangesAsync();

        return new ResponseData<WeeklyEvaluation>(200, "Tạo bản ghi thành công", weeklyEvaluation);
      }
      catch (Exception ex)
      {
        return new ResponseData<WeeklyEvaluation>(500, $"Có lỗi xảy ra tại server...{ex.Message}");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<WeeklyEvaluation>> GetAll()
    {
      try
      {
        var result = await _context.WeeklyEvaluations
            .Include(x => x.Teacher)
            .Include(x => x.Class)
            .AsNoTracking()
            .ToListAsync();


        return new ResponseData<WeeklyEvaluation>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<WeeklyEvaluation>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<WeeklyEvaluation>> GetById(int id)
    {
      try
      {
        var result = await _context.WeeklyEvaluations
          .Where(x => x.WeeklyEvaluationId == id)
          .Include(x => x.Teacher)
          .Include(x => x.Class)
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (result is null)
          return new ResponseData<WeeklyEvaluation>(404, "Dữ liệu không tồn tại");

        return new ResponseData<WeeklyEvaluation>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<WeeklyEvaluation>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<WeeklyEvaluation>> Update(int id, WeeklyEvaluationDto model)
    {
      try
      {
        // Find the WeeklyEvaluation to update
        var data = await _context.WeeklyEvaluations
            .FirstOrDefaultAsync(x => x.WeeklyEvaluationId == id);

        if (data == null)
        {
          return new ResponseData<WeeklyEvaluation>(400, "Dữ liệu không được cung cấp.");
        }

        // Update properties
        data.ClassId = model.ClassId;
        data.WeekId = model.WeekId;
        data.TeacherId = model.TeacherId;
        data.Description = model.Description;
        data.WeekNameEvaluation = model.WeekNameEvaluation;
        data.TotalScore = model.TotalScore;
        data.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new ResponseData<WeeklyEvaluation>(200, "Cập nhật thành công", data);
      }
      catch (Exception ex)
      {
        return new ResponseData<WeeklyEvaluation>(500, "Có lỗi cảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<WeeklyEvaluation>> Delete(int id)
    {
      try
      {
        if (id == 0)
        {
          return new ResponseData<WeeklyEvaluation>(400, "Dữ liệu không được cung cấp.");
        }

        var data = await _context.WeeklyEvaluations
         .FirstOrDefaultAsync(x => x.WeeklyEvaluationId == id);

        if (data == null)
        {
          return new ResponseData<WeeklyEvaluation>(404, "Không tìm thấy dữ liệu.");
        }
        _context.WeeklyEvaluations.Remove(data);
        await _context.SaveChangesAsync();

        return new ResponseData<WeeklyEvaluation>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<WeeklyEvaluation>(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<WeeklyEvaluation>> BulkDelete(List<int> ids)
    {
      try
      {
        if (ids is null)
        {
          return new ResponseData<WeeklyEvaluation>(400, "Dữ liệu không được cung cấp.");
        }
        var data = await _context.WeeklyEvaluations
         .Where(x => ids.Contains(x.WeeklyEvaluationId))
         .ToListAsync();

        if (data == null)
        {
          return new ResponseData<WeeklyEvaluation>(404, "Không tìm thấy dữ liệu.");
        }

        _context.WeeklyEvaluations.RemoveRange(data);
        await _context.SaveChangesAsync();

        return new ResponseData<WeeklyEvaluation>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<WeeklyEvaluation>(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<double> GetTotalScoreByWeekId(int id)
    {
      double totalScore = await (
                from c in _context.ChiTietSoDauBais
                where c.WeekId == id
                join f in _context.Classifications
                     on c.ClassificationId equals f.ClassificationId
                select (double)(f.Score ?? 0)
            ).SumAsync();

      return totalScore;
    }
  }
}
