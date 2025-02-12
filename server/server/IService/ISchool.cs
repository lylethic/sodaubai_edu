using server.Dtos;
using server.Types.School;

namespace server.IService
{
  public interface ISchool
  {
    Task<SchoolResType> CreateSchool(SchoolDto model);

    Task<SchoolResType> GetSchool(int id);

    Task<string> GetNameOfSchool(int id);

    Task<SchoolResType> GetSchools();

    Task<SchoolResType> GetSchoolsNoPagnination();

    Task<SchoolResType> DeleteSchool(int id);

    Task<SchoolResType> UpdateSchool(int id, SchoolDetail model);

    Task<ResponseData<string>> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);

    Task<ResponseData<string>> ExportSchoolsExcel(List<int> ids, string filePath);
  }
}
