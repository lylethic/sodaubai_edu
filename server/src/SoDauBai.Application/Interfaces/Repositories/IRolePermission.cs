using SoDauBai.Domain.Entities;
using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using System.Threading.Tasks;

namespace SoDauBai.Application.Interfaces.Repositories;

public interface IRolePermission
{
    Task<PaginatedResponse<RolePermission>> GetRolePermissions(QueryObject request);
    Task<RolePermission?> GetRolePermission(int id);
    Task<RolePermission> AddRolePermission(RolePermission entity);
    Task<RolePermission> UpdateRolePermission(RolePermission entity);
    Task<bool> DeleteRolePermission(int id);
}

