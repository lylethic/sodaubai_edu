using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Dtos;
using server.Models;
using server.Types.BiaSoDauBai;

namespace server.Interfaces
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
