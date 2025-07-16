using server.Application.Dtos;
using server.Domain.Entities;

namespace server.Application.Interfaces
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
