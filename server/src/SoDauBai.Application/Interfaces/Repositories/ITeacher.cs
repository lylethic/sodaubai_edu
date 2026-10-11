using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs.Types.Teacher;

namespace SoDauBai.Application.Interfaces.Repositories;

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
