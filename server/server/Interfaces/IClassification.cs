using server.Applications.ResponseModel;
using server.Dtos;
using server.Models;

namespace server.Interfaces
{
  public interface IClassification
  {
    Task<Classification> CreateAsync(ClassificationDto model);
    Task<Classification> GetByIDAsync(int id);
    Task<PaginatedResponse<ExtendClassification>> GetAllAsync(QueryObject request);
    Task<bool> DeleteAsync(int id);
    Task<Classification> PutAsync(int id, ClassificationDto model);
    Task<bool> BulkDeleteAsync(List<int> ids);
    Task<ResponseData<string>> ImportExcel(IFormFile file);
  }
}
