using SoDauBai.Application.DTOs;
using SoDauBai.Application.DTOs.Common;
using SoDauBai.Domain.Entities;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IRollCallDetail
  {
    Task<ResponseData<RollCallDetail>> CreateAsync(RollCallDetailDto model);
    Task<ResponseData<RollCallDetail>> UpdateAsync(int id, RollCallDetailDto model);
    Task<ResponseData<RollCallDetail>> GetAllAsync(QueryObject query);
    Task<ResponseData<RollCallDetail>> GetAllAsync(int rollCallId, QueryObject query);
    Task<ResponseData<RollCallDetail>> GetByIdAsync(int id);
    Task<ResponseData<RollCallDetail>> DeleteAsync(int id);
    Task<ResponseData<RollCallDetail>> BulkDeleteAsync(List<int> ids);
  }
}


