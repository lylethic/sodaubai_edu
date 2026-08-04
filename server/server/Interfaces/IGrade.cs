using server.Dtos;

namespace server.IService
{
  public interface IGrade
  {
    Task<ResponseData<GradeDto>> CreateGrade(GradeDto model);

    Task<ResponseData<GradeDetail>> GetGrade(int id);

    Task<ResponseData<List<GradeDetail>>> GetGrades();

    Task<ResponseData<GradeDto>> DeleteGrade(int id);

    Task<ResponseData<GradeDto>> UpdateGrade(int id, GradeDto model);

    Task<ResponseData<string>> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}
