using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs.Types.School;

namespace SoDauBai.Application.Interfaces.Repositories
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


