using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;

namespace SoDauBai.Application.Interfaces.Repositories
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


