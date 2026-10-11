using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface ISemester
  {
    Task<Semester> AddAsync(SemesterDto model);

    Task<ExtendSemester> GetByIDAsync(int id);

    Task<PaginatedResponse<ExtendSemester>> GetAllAsync(QueryObject request);

    Task<bool> DeleteAsync(int id);

    Task<Semester> UpdateAsync(int id, SemesterDto model);

    Task<bool> BulkDelete(List<int> ids);

    Task<ResponseData<string>> ImportExcelFile(IFormFile file);
  }
}


