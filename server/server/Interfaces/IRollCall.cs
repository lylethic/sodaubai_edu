using server.Dtos;
using server.Types.RollCall;

namespace server.IService
{
  public interface IRollCall
  {
    Task<RollCallResType> Create(RollCallDto model, List<RollCallDetailDto>? absenceDto);

    Task<RollCallResType> Update(int rollCallId, RollCallDto model);

    Task<RollCallResType> Delete(int rollCallId);

    Task<RollCallResType> BulkDelete(List<int> rollCallIds);

    Task<RollCallResType> RollCall(int rollCallIds);

    Task<RollCallResType> RollCalls(int weekId, int classId);
    // Task<RollCallResType> RollCalls(int weekId, int? classId);

    Task<RollCallResType> Import(int weekId, int classId);

    Task<RollCallResType> Export(int weekId, int classId);

    Task<RollCallResType> Update(int rollCallId, RollCallDto model, List<RollCallDetailDto> absenceDtos);
  }
}
