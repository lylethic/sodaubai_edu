using server.Dtos;
using server.Types.BiaSoDauBai;

namespace server.IService
{
  public interface IBiaSoDauBai
  {
    // Admin, includes status true and false
    Task<int> CountBiaSoDauBaiAsync();

    // User, includes only status true
    Task<int> CountBiaSoDauBaiActiveAsync();

    Task<BiaSoDauBaiResType> CreateBiaSoDauBai(BiaSoDauBaiDto model);

    Task<BiaSoDauBaiResType> GetBiaSoDauBai(int id);

    Task<BiaSoDauBaiResType> GetBiaSoDauBaiToUpdate(int id);

    Task<BiaSoDauBaiResType> GetBiaSoDauBais_Active(QueryObject? queryObject);

    Task<BiaSoDauBaiResType> GetBiaSoDauBaisBySchool_Active(int schoolId);

    // status true && false
    Task<BiaSoDauBaiResType> GetBiaSoDauBais(QueryObject? queryObject);

    Task<BiaSoDauBaiResType> GetBiaSoDauBaisBySchoolAndClass(int schoolId, int? classId);

    Task<BiaSoDauBaiResType> GetBiaSoDauBaisBySchool(QueryObject? queryObject, int schoolId);

    Task<BiaSoDauBaiResType> DeleteBiaSoDauBai(int id);

    Task<BiaSoDauBaiResType> UpdateBiaSoDauBai(int id, BiaSoDauBaiDto model);

    Task<BiaSoDauBaiResType> ImportExcel(IFormFile file);

    Task<BiaSoDauBaiResType> BulkDelete(List<int> ids);

    Task<BiaSoDauBaiResType> SearchBiaSoDauBais(BiaSoDauBaiSearchObject? searchObject);
  }
}
