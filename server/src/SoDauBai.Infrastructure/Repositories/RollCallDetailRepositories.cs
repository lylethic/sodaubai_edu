using Microsoft.EntityFrameworkCore;
using SoDauBai.Infrastructure.Data;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.DTOs.Common;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Domain.Entities;

using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;

namespace SoDauBai.Infrastructure.Repositories
{
  public class RollCallDetailRepositories : BaseRepository<RollCallDetail>, IRollCallDetail
  {
    public RollCallDetailRepositories(SoDauBaiContext context) : base(context)
    {
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
         .FirstOrDefaultAsync(x => x.Id == id);

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
         .Where(x => ids.Contains(x.Id))
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

    public async Task<ResponseData<RollCallDetail>> GetAllAsync(QueryObject query)
    {
      try
      {
        var rollCallDetails = _context.RollCallDetails.AsNoTracking();
        var total = await rollCallDetails.CountAsync();
        var result = await rollCallDetails
          .OrderBy(x => x.Id)
          .Skip((query.PageNumber - 1) * query.PageSize)
          .Take(query.PageSize)
          .ToListAsync();

        return new ResponseData<RollCallDetail>
        {
          StatusCode = 200,
          Message = "Thành công",
          ListData = result,
          Total = total
        };
      }
      catch (Exception ex)
      {
        return new ResponseData<RollCallDetail>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<RollCallDetail>> GetAllAsync(int rollCallId, QueryObject query)
    {
      try
      {
        var detailsQuery = _context.RollCallDetails
          .Include(x => x.Student)
          .AsNoTracking()
          .Where(x => x.RollCallId == rollCallId);
        var total = await detailsQuery.CountAsync();
        var result = await detailsQuery
          .OrderBy(x => x.Id)
          .Skip((query.PageNumber - 1) * query.PageSize)
          .Take(query.PageSize)
          .ToListAsync();

        if (total == 0)
        {
          return new ResponseData<RollCallDetail>(404, "Không tìm thấy dữ liệu");
        }

        return new ResponseData<RollCallDetail>
        {
          StatusCode = 200,
          Message = "Success",
          ListData = result,
          Total = total
        };
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
          .Where(x => x.Id == id)
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
            .FirstOrDefaultAsync(x => x.Id == id);

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

