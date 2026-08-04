using server.Dtos;

namespace server.IService
{
  public interface ISubject
  {
    Task<ResponseData<SubjectDto>> CreateSubject(SubjectDto model);
    Task<ResponseData<SubjectRes>> GetSubject(int id);
    Task<ResponseData<List<SubjectRes>>> GetSubjects();
    Task<ResponseData<SubjectDto>> DeleteSubject(int id);
    Task<ResponseData<SubjectDto>> UpdateSubject(int id, SubjectDto model);
    Task<ResponseData<string>> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}
