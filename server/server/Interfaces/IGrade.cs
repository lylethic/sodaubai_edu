using server.Applications.Search;
using server.Dtos;
using server.Models;
using server.Types.Grade;

namespace server.Interfaces
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
