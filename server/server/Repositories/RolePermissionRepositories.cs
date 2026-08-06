using server.Data;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications.ResponseModel;
using System.Threading.Tasks;

namespace server.Repositories;

public class RolePermissionRepositories : BaseRepository<RolePermission>, IRolePermission
{
    public RolePermissionRepositories(SoDauBaiContext context) : base(context)
    {
    }

    public async Task<PaginatedResponse<RolePermission>> GetRolePermissions(QueryObject request)
    {
        return await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);
    }

    public async Task<RolePermission?> GetRolePermission(int id)
    {
        return await GetByIdAsync(id);
    }

    public async Task<RolePermission> AddRolePermission(RolePermission entity)
    {
        return await AddAsync(entity);
    }

    public async Task<RolePermission> UpdateRolePermission(RolePermission entity)
    {
        var existing = await GetByIdAsync(entity.Id);
        if (existing == null) throw new System.Exception("RolePermission not found");

        if (entity.RoleId != 0) existing.RoleId = entity.RoleId;
        if (entity.PermissionId != 0) existing.PermissionId = entity.PermissionId;
        
        existing.DateUpdated = System.DateTime.Now;
        return await UpdateAsync(existing);
    }

    public async Task<bool> DeleteRolePermission(int id)
    {
        return await SoftDeleteAsync(id);
    }
}
