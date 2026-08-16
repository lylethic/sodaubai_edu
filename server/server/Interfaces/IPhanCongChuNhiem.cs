using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Dtos;
using server.Models;

namespace server.Interfaces
{
  public interface IPhanCongChuNhiem
  {
    Task<PhanCongChuNhiem> AddAsync(PhanCongChuNhiemDto model);

    Task<ExtendPhanCongChuNhiem> GetByIDAsync(int id);

    Task<PaginatedResponse<ExtendPhanCongChuNhiem>> GetAllAsync(PhanCongChuNhiemSearch request);

    Task<PhanCongChuNhiem> UpdateAsync(int id, PhanCongChuNhiemDto model);

    Task<bool> Async(int id);

    Task<bool> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}
