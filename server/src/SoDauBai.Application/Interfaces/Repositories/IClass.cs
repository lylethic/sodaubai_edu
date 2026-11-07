using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IClass
  {
    Task<ClassDto> AddAsync(ClassDto model);
    Task<List<ClassDto>> AddBulkAsync(List<ClassDto> models);
    Task<ClassDetails> GetAsync(int id);
    Task<Tuple<IEnumerable<ClassDetails>, int, int, int>> GetAllAsync(ClassSearch queryObject);
    Task<ClassDto> UpdateAsync(int id, ClassDto model);
    Task<bool> BulkDeleteAsync(List<int> ids);
    Task<bool> DeleteAsync(int id);
    Task<string> ImportExcel(IFormFile file);
  }
}


