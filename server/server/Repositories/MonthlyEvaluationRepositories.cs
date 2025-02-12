using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Models;

namespace server.Repositories
{
  public class MonthlyEvaluationRepositories : IMonthlyEvaluation
  {
    private readonly SoDauBaiContext _context;
    public MonthlyEvaluationRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ResponseData<MonthlyEvaluation>> Create(MonthlyEvaluationDto model)
    {
      try
      {
        if (model is null)
          return new ResponseData<MonthlyEvaluation>(400, "Vui lòng cung cấp thông tin!");

        var monthlyEvaluation = new MonthlyEvaluation
        {
          MonthEvaluation = model.MonthEvaluation,

        };


      }
      catch (System.Exception ex)
      {
        return new ResponseData<MonthlyEvaluation>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
      throw new NotImplementedException();
    }

    public async Task<ResponseData<MonthlyEvaluation>> GetAll()
    {
      try
      {
        var monthlyEvaluation = await _context.MonthlyEvaluations
        .AsNoTracking()
        .ToListAsync();
        return new ResponseData<MonthlyEvaluation>(200, "Thành công", monthlyEvaluation);
      }
      catch (System.Exception ex)
      {
        return new ResponseData<MonthlyEvaluation>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public async Task<ResponseData<MonthlyEvaluation>> GetById(int id)
    {
      try
      {
        if (id == 0)
          return new ResponseData<MonthlyEvaluation>(400, "Vui lòng cung cấp thông tin");

        var monthlyEvaluation = await _context.MonthlyEvaluations
        .Where(x => x.MonthlyEvaluationId == id)
        .AsNoTracking()
        .SingleOrDefaultAsync();

        if (monthlyEvaluation is null)
          return new ResponseData<MonthlyEvaluation>(404, "Không tìm thấy đánh giá điểm theo tháng");


        return new ResponseData<MonthlyEvaluation>(200, "Thành công", monthlyEvaluation);
      }
      catch (System.Exception ex)
      {
        return new ResponseData<MonthlyEvaluation>(500, "Có lỗi xảy ra tại server...");
        throw new Exception(ex.Message);
      }
    }

    public Task<ResponseData<MonthlyEvaluation>> Update(int id, MonthlyEvaluationDto model)
    {
      throw new NotImplementedException();
    }

    public Task<ResponseData<MonthlyEvaluation>> Delete(int id)
    {
      throw new NotImplementedException();
    }

    public Task<ResponseData<MonthlyEvaluation>> BulkDelete(List<int> ids)
    {
      throw new NotImplementedException();
    }
  }
}
