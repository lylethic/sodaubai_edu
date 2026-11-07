using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs.Types.PhanCongGDBia;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IPhanCongGiangDaySoDauBai
  {
    Task<PC_GiangDay_BiaSDBDto> AddAsync(PC_GiangDay_BiaSDBDto model);
    Task<MapData?> GetByIDAsync(int id);
    Task<MapData?> GetPhanCongGiangDayByBia(int biaId);
    Task<PaginatedResponse<MapData>> GetPC_GiangDay_BiaSDBs(PhanCongGiangDaySearch request);
    Task<PC_GiangDay_BiaSDBDto> UpdateAsync(int id, PC_GiangDay_BiaSDBDto model);
    Task<bool> DeleteAsync(int id);
    Task<bool> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}


