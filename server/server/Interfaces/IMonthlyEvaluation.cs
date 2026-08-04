using server.Dtos;
using server.Models;

namespace server.IService
{
  public interface IMonthlyEvaluation
  {
    Task<ResponseData<MonthlyEvaluation>> Create(MonthlyEvaluationDto model);
    Task<ResponseData<MonthlyEvaluation>> Update(int id, MonthlyEvaluationDto model);
    Task<ResponseData<MonthlyEvaluation>> Delete(int id);
    Task<ResponseData<MonthlyEvaluation>> BulkDelete(List<int> ids);
    Task<ResponseData<MonthlyEvaluation>> GetAll();
    Task<ResponseData<MonthlyEvaluation>> GetById(int id);
  }
}
