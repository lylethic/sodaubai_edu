using server.Models;
using server.Applications.ResponseModel;
using server.Dtos;
using System.Threading.Tasks;

namespace server.Interfaces;

public interface IPermission
{
  Task<PaginatedResponse<Permission>> GetPermissions(QueryObject request);
  Task<Permission?> GetPermission(int id);
  Task<Permission> AddPermission(Permission entity);
  Task<Permission> UpdatePermission(Permission entity);
  Task<bool> DeletePermission(int id);

  //
  Task<List<Permission>> GetPermissionsByRoleAsync(string roleName);
  Task<List<Role>> GetUserRolesAsync(int userId);
  Task<List<Permission>> GetUserPermissionsAsync(int userId);
  Task<bool> UserHasPermissionAsync(int userId, string permissionName);
  Task<bool> UserHasRoleAsync(int userId, string roleName);
  Task<UserRolesAndPermissions> GetUserRolesAndPermissionsAsync(int userId);
}
