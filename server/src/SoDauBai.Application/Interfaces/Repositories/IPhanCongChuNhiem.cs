using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IPhanCongChuNhiem
  {
    Task<PhanCongChuNhiem> AddAsync(PhanCongChuNhiemDto model);

    Task<ExtendPhanCongChuNhiem> GetByIDAsync(int id);

    Task<PaginatedResponse<ExtendPhanCongChuNhiem>> GetAllAsync(PhanCongChuNhiemSearch request);

    Task<PhanCongChuNhiem> UpdateAsync(int id, PhanCongChuNhiemDto model);

    Task<bool> DeleteAsync(int id);

    Task<bool> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}


