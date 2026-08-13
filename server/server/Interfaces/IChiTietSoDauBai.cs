using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Dtos;
using server.Models;
using server.Types.ChiTietSoDauBai;

namespace server.Interfaces
{
  public interface IChiTietSoDauBai
  {
    Task<ChiTietSoDauBai> CreateChiTietSoDauBai(ChiTietSoDauBaiDto model);

    Task<ChiTietSoDauBai> GetChiTietSoDauBai(int id);

    Task<PaginatedResponse<ExtendChiTietSoDauBai>> GetChiTietSoDauBais(ChiTietSoDauBaiSearch request);

    Task<ChiTietSoDauBai> UpdateChiTietSoDauBai(int id, ChiTietSoDauBaiDto model);

    Task<bool> DeleteChiTietSoDauBai(int id);

    Task<bool> BulkDelete(List<int> ids);

    Task<ChiTietSoDauBaiResType> ImportExcel(IFormFile file);

    Task<ChiTietSoDauBaiResType> ExportChiTietSoDauBaiToExcel(int weekId, int classId, string filePath);
  }
}
