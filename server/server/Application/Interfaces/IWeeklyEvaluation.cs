using server.Application.Dtos;
using server.Domain.Entities;
using server.Types.Weekly;

namespace server.Application.Interfaces
{
    public interface IWeeklyEvaluation
    {
        Task<ResponseData<WeeklyEvaluation>> Create(WeeklyEvaluationDto model);
        Task<ResponseData<WeeklyEvaluation>> Update(int id, WeeklyEvaluationDto model);
        Task<ResponseData<WeeklyEvaluation>> Delete(int id);
        Task<ResponseData<WeeklyEvaluation>> BulkDelete(List<int> ids);
        Task<ResponseData<WeeklyEvaluation>> GetAllByWeek(int weekId);
        Task<ResponseData<WeeklyEvaluationRes>> GetAllScoreByWeek(int schoolId, int weekId, int gradeId);
        Task<ResponseData<WeeklyEvaluation>> GetById(int id);
        Task<double> GetTotalScoreByWeekId(int id);
    }
}
