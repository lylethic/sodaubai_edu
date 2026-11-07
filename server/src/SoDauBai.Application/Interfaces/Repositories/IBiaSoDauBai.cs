using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs.Types.BiaSoDauBai;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IBiaSoDauBai
  {
    Task<BiaSoDauBai> CreateBiaSoDauBai(BiaSoDauBaiDto model);

    Task<BiaSoDauBai> GetBiaSoDauBai(int id);

    // status true && false
    Task<PaginatedResponse<ExtendBiaSoDauBai>> GetBiaSoDauBais(BiaSoDauBaiSearch queryObject);

    Task<bool> DeleteBiaSoDauBai(int id);

    Task<BiaSoDauBai> UpdateBiaSoDauBai(int id, BiaSoDauBaiDto model);

    Task<bool> BulkDelete(List<int> ids);

    Task<BiaSoDauBaiResType> ImportExcel(IFormFile file);
  }
}


