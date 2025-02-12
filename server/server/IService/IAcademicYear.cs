using server.Dtos;

namespace server.IService
{
  public interface IAcademicYear
  {
    Task<ResponseData<AcademicYearDto>> CreateAcademicYear(AcademicYearDto model);

    Task<ResponseData<AcademicYearDto>> GetAcademicYear(int id);

    Task<ResponseData<List<AcademicYearDto>>> GetAcademicYears();

    Task<ResponseData<AcademicYearDto>> DeleteAcademicYear(int id);

    Task<ResponseData<AcademicYearDto>> UpdateAcademicYear(int id, AcademicYearDto model);

    Task<ResponseData<string>> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcel(IFormFile file);
  }
}
