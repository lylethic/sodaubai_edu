using server.Dtos;
using server.Types.LopHoc;

namespace server.IService
{
  public interface IClass
  {
    Task<ResponseData<ClassDto>> CreateClass(ClassDto model);
    Task<ResponseData<ClassDetails>> GetClass(int id);
    Task<ResponseData<ClassDto>> GetClassDetail(int id);
    Task<ResponseData<List<ClassList>>> ClassList(QueryObject? queryObject);
    Task<ResponseData<List<ClassDetails>>> GetClasses();
    Task<ResponseData<ClassDetails>> GetLopChuNhiemByTeacherID(int teacherId);
    Task<ResponseData<ClassDto>> DeleteClass(int id);
    Task<ResponseData<ClassDto>> UpdateClass(int id, ClassDto model);
    Task<ResponseData<string>> ImportExcel(IFormFile file);
    Task<ResponseData<string>> BulkDelete(List<int> ids);
    Task<ResponseData<List<ClassDetails>>> GetClassesBySchool(int schoolId);
    Task<ResponseData<List<ClassDto>>> CreateClasses(List<ClassDto> models);
  }
}
