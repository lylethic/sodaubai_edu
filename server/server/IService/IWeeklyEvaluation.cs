using server.Dtos;
using server.Models;

namespace server.IService
{
  public interface IWeeklyEvaluation
  {
    Task<ResponseData<WeeklyEvaluation>> Create(WeeklyEvaluationDto model);
    Task<ResponseData<WeeklyEvaluation>> Update(int id, WeeklyEvaluationDto model);
    Task<ResponseData<WeeklyEvaluation>> Delete(int id);
    Task<ResponseData<WeeklyEvaluation>> BulkDelete(List<int> ids);
    Task<ResponseData<WeeklyEvaluation>> GetAll();
    Task<ResponseData<WeeklyEvaluation>> GetById(int id);
    Task<double> GetTotalScoreByWeekId(int id);
  }
}
