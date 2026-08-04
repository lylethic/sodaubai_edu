using server.Dtos;
using server.Models;

namespace server.IService
{
  public interface IRollCallDetail
  {
    Task<ResponseData<RollCallDetail>> CreateAsync(RollCallDetailDto model);
    Task<ResponseData<RollCallDetail>> UpdateAsync(int id, RollCallDetailDto model);
    Task<ResponseData<RollCallDetail>> GetAllAsync();
    Task<ResponseData<RollCallDetail>> GetAllAsync(int rollCallId);
    Task<ResponseData<RollCallDetail>> GetByIdAsync(int id);
    Task<ResponseData<RollCallDetail>> DeleteAsync(int id);
    Task<ResponseData<RollCallDetail>> BulkDeleteAsync(List<int> ids);
  }
}
