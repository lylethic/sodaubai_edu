using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs.Types.Week;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IWeek
  {
    Task<Week> AddAsync(WeekDto model);
    Task<Week?> GetByIDAsync(int id);
    Task<PaginatedResponse<ExtendWeek>> GetWeeks(WeekSearch request);
    Task<Week> UpdateAsync(int id, WeekDto model);
    Task<bool> DeleteAsync(int id);
    Task<bool> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
    Task<WeekResType> Get7DaysInWeek(int selectedWeekId);
  }
}


