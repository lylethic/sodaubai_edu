using server.Dtos;
using server.Types.Teacher;

namespace server.IService
{
  public interface ITeacher
  {
    Task<TeacherResType> CreateTeacher(TeacherDto model);

    Task<TeacherResType> GetTeacher(int id);

    Task<TeacherResType> GetTeacherToUpdate(int id);

    Task<int> GetCountTeachersBySchool(int? id = null);

    Task<TeacherResType> GetTeachers(QueryObject? queryObject);

    Task<TeacherResType> GetTeacherIdByAccountId(int accountId);

    Task<TeacherResType> GetTeachersBySchool(QueryObject? queryObject, int schoolId);

    Task<TeacherResType> GetTeachersBySchool(int? schoolId);

    Task<TeacherResType> DeleteTeacher(int id);

    Task<TeacherResType> UpdateTeacher(int id, TeacherDto model);

    Task<TeacherResType> ImportExcelFile(IFormFile file);

    Task<ResponseData<string>> BulkDelete(List<int> ids);

    Task<TeacherResType> SearchTeacher(QueryObjects? queryObject);
  }
}
