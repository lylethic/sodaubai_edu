using server.Models;
using server.Applications.ResponseModel;
using server.Dtos;
using System.Threading.Tasks;

namespace server.Interfaces;

public interface IRolePermission
{
    Task<PaginatedResponse<RolePermission>> GetRolePermissions(QueryObject request);
    Task<RolePermission?> GetRolePermission(int id);
    Task<RolePermission> AddRolePermission(RolePermission entity);
    Task<RolePermission> UpdateRolePermission(RolePermission entity);
    Task<bool> DeleteRolePermission(int id);
}
