using server.Dtos;

namespace server.IService
{
  public interface IStudent
  {
    Task<ResponseData<StudentDto>> CreateStudent(StudentDto model);
    Task<ResponseData<StudentDetail>> GetStudent(int id);
    Task<ResponseData<List<StudentDetail>>> GetStudents(int? schoolId);
    Task<ResponseData<List<StudentDetail>>> GetStudents(int schoolId, int classId);
    Task<ResponseData<StudentDto>> DeleteStudent(int id);
    Task<ResponseData<StudentDto>> UpdateStudent(int id, StudentDto model);
    Task<ResponseData<string>> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcel(IFormFile file);
  }
}
