using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Dtos;
using server.Models;

namespace server.Interfaces
{
  public interface ISubject
  {
    Task<Subject> AddAsync(SubjectDto model);
    Task<Subject> GetByIDAsync(int id);
    Task<PaginatedResponse<ExtendSubject>> GetSubjects(SubjectSearch request);
    Task<Subject> UpdateAsync(int id, SubjectDto model);
    Task<bool> DeleteAsync(int id);
    Task<bool> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}
