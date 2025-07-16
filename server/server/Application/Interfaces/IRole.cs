using server.Application.Dtos;
using server.Domain.Entities;
using server.Types.Role;

namespace server.Application.Interfaces
{
    public interface IRole
    {
        Task<(IEnumerable<RoleDto>, int total)> GetRoles(PaginationRequest pagination);

        Task<RoleResType> GetRolesNoPagnination();

        Task<RoleResType> GetRole(int id);

        Task<RoleResType> AddRole(RoleDto role);

        Task<RoleResType> UpdateRole(int id, RoleDto role);

        Task<RoleResType> DeleteRole(int id);

        Task<string> ImportExcel(IFormFile file);

        Task<RoleResType> BulkDelete(List<int> ids);

        Task<RoleResType> ExportRolesExcel(List<int> ids, string filePath);

        Task<int> GetCountRoles();
    }
}
