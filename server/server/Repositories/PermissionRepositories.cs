using server.Data;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications.ResponseModel;
using System.Threading.Tasks;

namespace server.Repositories;

public class PermissionRepositories : BaseRepository<Permission>, IPermission
{
  public PermissionRepositories(SoDauBaiContext context) : base(context)
  {
  }

  public async Task<PaginatedResponse<Permission>> GetPermissions(QueryObject request)
  {
    return await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);
  }

  public async Task<Permission?> GetPermission(int id)
  {
    return await GetByIdAsync(id);
  }

  public async Task<Permission> AddPermission(Permission entity)
  {
    return await AddAsync(entity);
  }

  public async Task<Permission> UpdatePermission(Permission entity)
  {
    var existing = await GetByIdAsync(entity.Id);
    if (existing == null) throw new Exception("Permission not found");

    if (!string.IsNullOrEmpty(entity.Name)) existing.Name = entity.Name;
    if (entity.Description != null) existing.Description = entity.Description;
    
    existing.DateUpdated = DateTime.Now;
    
    return await UpdateAsync(existing);
  }

  public async Task<bool> DeletePermission(int id)
  {
    return await SoftDeleteAsync(id);
  }
}
