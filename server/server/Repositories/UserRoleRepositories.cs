using server.Data;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications.ResponseModel;
using System.Threading.Tasks;

namespace server.Repositories;

public class UserRoleRepositories : BaseRepository<UserRole>, IUserRole
{
    public UserRoleRepositories(SoDauBaiContext context) : base(context)
    {
    }

    public async Task<PaginatedResponse<UserRole>> GetUserRoles(QueryObject request)
    {
        return await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);
    }

    public async Task<UserRole?> GetUserRole(int id)
    {
        return await GetByIdAsync(id);
    }

    public async Task<UserRole> AddUserRole(UserRole entity)
    {
        return await AddAsync(entity);
    }

    public async Task<UserRole> UpdateUserRole(UserRole entity)
    {
        var existing = await GetByIdAsync(entity.Id);
        if (existing == null) throw new System.Exception("UserRole not found");

        if (entity.RoleId != 0) existing.RoleId = entity.RoleId;
        if (entity.UserId != 0) existing.UserId = entity.UserId;
        
        existing.DateUpdated = System.DateTime.Now;
        return await UpdateAsync(existing);
    }

    public async Task<bool> DeleteUserRole(int id)
    {
        return await SoftDeleteAsync(id);
    }
}
