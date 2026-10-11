using SoDauBai.Infrastructure.Data;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.Common.Models;
using System.Threading.Tasks;

namespace SoDauBai.Infrastructure.Repositories;

public class UserPermissionRepositories : BaseRepository<UserPermission>, IUserPermission
{
  public UserPermissionRepositories(SoDauBaiContext context) : base(context)
  {
  }

  public async Task<PaginatedResponse<UserPermission>> GetUserPermissions(QueryObject request)
  {
    return await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);
  }

  public async Task<UserPermission?> GetUserPermission(int id)
  {
    return await GetByIdAsync(id);
  }

  public async Task<UserPermission> AddUserPermission(UserPermission entity)
  {
    return await AddAsync(entity);
  }

  public async Task<UserPermission> UpdateUserPermission(UserPermission entity)
  {
    var existing = await GetByIdAsync(entity.Id);
    if (existing == null) throw new System.Exception("UserPermission not found");

    if (entity.UserId != 0) existing.UserId = entity.UserId;
    if (entity.PermissionId != 0) existing.PermissionId = entity.PermissionId;
    // Assuming IsGranted is boolean and defaults to false. 
    existing.IsGranted = entity.IsGranted;

    existing.DateUpdated = System.DateTime.UtcNow;
    return await UpdateAsync(existing);
  }

  public async Task<bool> DeleteUserPermission(int id)
  {
    return await SoftDeleteAsync(id);
  }
}

