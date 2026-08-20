using server.Applications.ResponseModel;
using server.Applications.Search;
using server.Dtos;
using server.Models;
using server.Types.Teacher;

namespace server.Interfaces;

public interface ITeacher
{
  Task<ExtendTeacher> GetByIDAsync(int id);

  Task<PaginatedResponse<ExtendTeacher>> GetAllAsync(TeacherSearch queryObject);

  Task<Teacher> AddAsync(TeacherCreateBody model);

  Task<Teacher> UpdateAsync(int id, TeacherCreateBody model);

  Task<Teacher> UpdateImageAsync(int id, IFormFile file);

  Task<bool> DeleteAsync(int id);

  Task<bool> BulkDelete(List<int> ids);

  Task<TeacherResType> ImportExcelFile(IFormFile file);
}