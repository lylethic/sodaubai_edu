using server.Dtos;
using server.Types.ChuNhiem;

namespace server.IService
{
  public interface IPC_ChuNhiem
  {
    Task<ChuNhiemResType> CreatePC_ChuNhiem(PC_ChuNhiemDto model);

    Task<ChuNhiemResType> GetPC_ChuNhiem(int id);

    Task<ChuNhiemResType> GetPC_ChuNhiems();

    Task<ChuNhiemResType> Get_ChuNhiem_Teacher_Class(int schoolId, int? gradeId, int? classId);

    Task<ChuNhiemResType> UpdatePC_ChuNhiem(int id, PC_ChuNhiemDto model);

    Task<ChuNhiemResType> DeletePC_ChuNhiem(int id);

    Task<ChuNhiemResType> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}
