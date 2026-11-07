using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IStudent
  {
    Task<StudentDto> AddAsync(StudentDto model);
    Task<StudentDetail?> GetByIDAsync(int id);
    Task<PaginatedResponse<StudentDetail>> GetStudents(StudentSearch request);
    Task<List<StudentDetail>> GetStudentsByClass(int schoolId, int classId);
    Task<StudentDto> UpdateAsync(int id, StudentDto model);
    Task<bool> DeleteAsync(int id);
    Task<bool> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcel(IFormFile file);
  }
}


