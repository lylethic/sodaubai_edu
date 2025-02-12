using server.Dtos;
using server.Types.Week;

namespace server.IService
{
  public interface IWeek
  {
    Task<ResponseData<WeekDto>> CreateWeek(WeekDto model);

    Task<ResponseData<WeekData>> GetWeek(int id);
    Task<ResponseData<WeekDto>> GetWeekToUpdate(int id);

    Task<ResponseData<List<WeekData>>> GetWeeks();

    Task<ResponseData<List<WeekDto>>> GetWeeksBySemester(int semesterId);

    Task<ResponseData<WeekDto>> DeleteWeek(int id);

    Task<ResponseData<WeekDto>> UpdateWeek(int id, WeekDto model);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);

    Task<ResponseData<string>> BulkDelete(List<int> ids);

    Task<WeekResType> Get7DaysInWeek(int selectedWeekId);
  }
}
