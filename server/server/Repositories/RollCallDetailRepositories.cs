using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;

namespace server.Repositories
{
  public class RollCallDetailRepositories : IRollCallDetail
  {
    private readonly SoDauBaiContext _context;
    public RollCallDetailRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<RollCallDetail>> CreateAsync(RollCallDetailDto model)
    {
      try
      {
        if (model is null)
        {
          return new ResponseData<RollCallDetail>(400, "Vui lòng cung cấp dữ liệu");
        }
        var data = new RollCallDetail
        {
          RollCallId = model.RollCallId,
          Description = model.Description,
          StudentId = model.StudentId,
          IsExcused = model.IsExecute,
        };
        _context.RollCallDetails.Add(data);
        await _context.SaveChangesAsync();
        return new ResponseData<RollCallDetail>(200, "Thành công", data);
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Có lỗi xảy ra tại servre...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<RollCallDetail>> DeleteAsync(int id)
    {
      try
      {
        if (id == 0)
        {
          return new ResponseData<RollCallDetail>(400, "Dữ liệu không được cung cấp.");
        }

        var data = await _context.RollCallDetails
         .FirstOrDefaultAsync(x => x.AbsenceId == id);

        if (data == null)
        {
          return new ResponseData<RollCallDetail>(404, "Không tìm thấy dữ liệu.");
        }
        _context.RollCallDetails.Remove(data);
        await _context.SaveChangesAsync();

        return new ResponseData<RollCallDetail>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<RollCallDetail>> BulkDeleteAsync(List<int> ids)
    {
      try
      {
        if (ids is null)
        {
          return new ResponseData<RollCallDetail>(400, "Dữ liệu không được cung cấp.");
        }
        var data = await _context.RollCallDetails
         .Where(x => ids.Contains(x.AbsenceId))
         .ToListAsync();

        if (data == null)
        {
          return new ResponseData<RollCallDetail>(404, "Không tìm thấy dữ liệu.");
        }

        _context.RollCallDetails.RemoveRange(data);
        await _context.SaveChangesAsync();

        return new ResponseData<RollCallDetail>(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Đang xảy ra lỗi tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<RollCallDetail>> GetAllAsync()
    {
      try
      {
        var result = await _context.RollCallDetails
          .AsNoTracking()
          .ToListAsync();

        return new ResponseData<RollCallDetail>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<RollCallDetail>> GetAllAsync(int rollCallId)
    {
      try
      {
        var result = await _context.RollCallDetails
          .Include(x => x.Student)
          .AsNoTracking()
          .Where(x => x.RollCallId == rollCallId)
          .ToListAsync();

        if (!result.Any())
        {
          return new ResponseData<RollCallDetail>(404, "Không tìm thấy dữ liệu");
        }

        return new ResponseData<RollCallDetail>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<RollCallDetail>> GetByIdAsync(int id)
    {
      try
      {
        var result = await _context.RollCallDetails
          .Where(x => x.AbsenceId == id)
          .AsNoTracking()
          .FirstOrDefaultAsync();

        if (result is null)
          return new ResponseData<RollCallDetail>(404, "Dữ liệu không tồn tại");

        return new ResponseData<RollCallDetail>(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }

    }

    public async Task<ResponseData<RollCallDetail>> UpdateAsync(int id, RollCallDetailDto model)
    {
      try
      {
        // Find the WeeklyEvaluation to update
        var data = await _context.RollCallDetails
            .FirstOrDefaultAsync(x => x.AbsenceId == id);

        if (data == null)
        {
          return new ResponseData<RollCallDetail>(400, "Dữ liệu không được cung cấp.");
        }

        // Update properties
        data.RollCallId = model.RollCallId;
        data.StudentId = model.StudentId;
        data.Description = model.Description;
        data.IsExcused = model.IsExecute;

        await _context.SaveChangesAsync();

        return new ResponseData<RollCallDetail>(200, "Cập nhật thành công", data);
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Có lỗi cảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }
  }
}
