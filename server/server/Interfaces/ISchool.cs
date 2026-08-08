using server.Applications.ResponseModel;
using server.Dtos;
using server.Models;
using server.Types.School;

namespace server.Interfaces
{
  public interface ISchool
  {
    Task<School> CreateSchool(SchoolDto model);

    Task<School> GetSchool(int id);

    Task<string> GetNameOfSchool(int id);

    Task<PaginatedResponse<School>> GetSchools(QueryObject request);

    Task<bool> DeleteSchool(int id);

    Task<School> UpdateSchool(int id, SchoolDto model);

    Task<bool> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);

    Task<ResponseData<string>> ExportSchoolsExcel(List<int> ids, string filePath);
  }
}
