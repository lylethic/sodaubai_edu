using SoDauBai.Application.DTOs;
using SoDauBai.Application.DTOs.Types.RollCall;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface IRollCall
  {
    Task<RollCallResType> Create(RollCallDto model, List<RollCallDetailDto>? absenceDto);
    Task<RollCallResType> Update(int rollCallId, RollCallDto model);
    Task<RollCallResType> Update(int rollCallId, RollCallDto model, List<RollCallDetailDto> absenceDtos);
    Task<RollCallResType> Delete(int rollCallId);
    Task<RollCallResType> BulkDelete(List<int> rollCallIds);
    Task<RollCallResType> RollCall(int rollCallId);
    Task<RollCallResType> RollCalls(int weekId, int classId);
    Task<RollCallResType> Import(int weekId, int classId);
    Task<RollCallResType> Export(int weekId, int classId);
  }
}


