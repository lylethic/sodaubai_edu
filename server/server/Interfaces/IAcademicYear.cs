using server.Applications.ResponseModel;
using server.Dtos;
using server.Models;

namespace server.IService
{
  public interface IAcademicYear
  {
    Task<PaginatedResponse<AcademicYear>> GetAcademicYears(QueryObject request);

    Task<AcademicYear> GetAcademicYear(int id);

    Task<AcademicYear> CreateAcademicYear(AcademicYearDto model);

    Task<AcademicYear> UpdateAcademicYear(int id, AcademicYearDto model);

    Task<bool> DeleteAcademicYear(int id);

    Task<bool> BulkDelete(List<int> ids);

    Task<string> ImportExcel(IFormFile file);
  }
}
