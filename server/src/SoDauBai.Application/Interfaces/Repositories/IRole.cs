using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs.Types.Role;

namespace SoDauBai.Application.Interfaces.Repositories
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


