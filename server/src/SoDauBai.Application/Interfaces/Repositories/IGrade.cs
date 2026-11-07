using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs.Types.Grade;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IGrade
  {
    Task<Tuple<IEnumerable<GradeDetail>, int, int, int>> GetAllAsync(GradeSearch request);

    Task<Grade> GetAsync(int id);

    Task<Grade> AddAsync(GradeDto model);

    Task<Grade> UpdateAsync(int id, GradeDto model);

    Task<bool> DeleteAsync(int id);

    Task<bool> BulkDeleteAsync(List<int> ids);

    Task<string> ImportExcel(IFormFile file);

    Task<GradeResType> ExportGradesExcel(List<int> ids, string filePath);
  }
}


