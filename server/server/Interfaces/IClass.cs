using server.Applications.ResponseModel;
using server.Dtos;
using server.Types.LopHoc;

namespace server.IService
{
  public interface IClass
  {
    Task<ClassDto> CreateClass(ClassDto model);
    Task<ClassDetails> GetClass(int id);
    Task<ClassDto> GetClassDetail(int id);
    Task<PaginatedResponse<ClassList>> ClassList(QueryObject? queryObject);
    Task<List<ClassDetails>> GetClasses(QueryObject? queryObject);
    Task<ClassDetails> GetLopChuNhiemByTeacherID(int teacherId);
    Task<bool> DeleteClass(int id);
    Task<ClassDto> UpdateClass(int id, ClassDto model);
    Task<string> ImportExcel(IFormFile file);
    Task<bool> BulkDelete(List<int> ids);
    Task<PaginatedResponse<ClassDetails>> GetClassesBySchool(int schoolId, QueryObject? queryObject);
    Task<List<ClassDetails>> GetClassesBySchoolNoLimit(int schoolId);
    Task<List<ClassDto>> CreateClasses(List<ClassDto> models);
  }
}
