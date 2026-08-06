using server.Data;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications.ResponseModel;
using System.Threading.Tasks;

namespace server.Repositories;

public class UserRepositories : BaseRepository<User>, IUser
{
    public UserRepositories(SoDauBaiContext context) : base(context)
    {
    }

    public async Task<PaginatedResponse<User>> GetUsers(QueryObject request)
    {
        return await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);
    }

    public async Task<User?> GetUser(int id)
    {
        return await GetByIdAsync(id);
    }

    public async Task<User> AddUser(User entity)
    {
        return await AddAsync(entity);
    }

    public async Task<User> UpdateUser(User entity)
    {
        var existing = await GetByIdAsync(entity.Id);
        if (existing == null) throw new System.Exception("User not found");

        if (entity.SchoolId != null && entity.SchoolId != 0) existing.SchoolId = entity.SchoolId;
        if (!string.IsNullOrEmpty(entity.Email)) existing.Email = entity.Email;
        if (!string.IsNullOrEmpty(entity.Username)) existing.Username = entity.Username;
        if (!string.IsNullOrEmpty(entity.Avatar)) existing.Avatar = entity.Avatar;
        if (!string.IsNullOrEmpty(entity.PasswordHash)) existing.PasswordHash = entity.PasswordHash;
        
        existing.DateUpdated = System.DateTime.Now;
        return await UpdateAsync(existing);
    }

    public async Task<bool> DeleteUser(int id)
    {
        return await SoftDeleteAsync(id);
    }
}
