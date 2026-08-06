using server.Applications.ResponseModel;
using server.Dtos;
using server.Models;
using server.Types.Role;

namespace server.IService
{
  public interface IRole
  {
    Task<PaginatedResponse<Role>> GetRoles(QueryObject request);

    Task<Role> GetRole(int id);

    Task<Role> AddRole(RoleDto role);

    Task<Role> UpdateRole(int id, RoleDto role);

    Task<bool> DeleteRole(int id);

    Task<string> ImportExcel(IFormFile file);

    Task<bool> BulkDelete(List<int> ids);

    Task<RoleResType> ExportRolesExcel(List<int> ids, string filePath);
  }
}
