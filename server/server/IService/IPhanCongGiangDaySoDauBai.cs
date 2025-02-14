using server.Dtos;
using server.Types.PhanCongGDBia;

namespace server.IService
{
  public interface IPhanCongGiangDaySoDauBai
  {
    Task<PhanCongGiangDayBiaResType> CreatePC_GiangDay_BiaSDB(PC_GiangDay_BiaSDBDto model);

    Task<PhanCongGiangDayBiaResType> GetPC_GiangDay_BiaSDB(int id);

    Task<PhanCongGiangDayBiaResType> GetPhanCongGiangDayByBia(int biaId);

    Task<PhanCongGiangDayBiaResType> GetPC_GiangDay_BiaSDBs();

    Task<PhanCongGiangDayBiaResType> DeletePC_GiangDay_BiaSDB(int id);

    Task<PhanCongGiangDayBiaResType> UpdatePC_GiangDay_BiaSDB(int id, PC_GiangDay_BiaSDBDto model);

    Task<PhanCongGiangDayBiaResType> BulkDelete(List<int> ids);

    Task<PhanCongGiangDayBiaResType> ImportExcelFile(IFormFile file);
  }
}
