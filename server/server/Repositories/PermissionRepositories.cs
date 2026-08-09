using server.Data;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications.ResponseModel;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using server.Common.Exceptions;

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
    if (existing == null) throw new NotFoundException("Quyền không tồn tại");

    if (!string.IsNullOrEmpty(entity.Name)) existing.Name = entity.Name;
    if (entity.Description != null) existing.Description = entity.Description;

    existing.DateUpdated = DateTime.UtcNow;

    return await UpdateAsync(existing);
  }

  public async Task<bool> DeletePermission(int id)
  {
    return await SoftDeleteAsync(id);
  }

  public async Task<List<Permission>> GetPermissionsByRoleAsync(string roleName)
  {
    var permissions = await _context.RolePermissions
        .Where(rp => rp.Role.NameRole == roleName)
        .Select(rp => rp.Permission)
        .Distinct()
        .ToListAsync();
    return permissions;
  }

  public async Task<List<Role>> GetUserRolesAsync(int userId)
  {
    var data = await _context.UserRoles
      .Where(ur => ur.User.Id == userId)
      .Select(ur => ur.Role)
      .ToListAsync();
    return data;
  }

  public async Task<List<Permission>> GetUserPermissionsAsync(int userId)
  {
    var permissions = await _context.UserRoles
        .Where(ur => ur.UserId == userId)
        .SelectMany(ur => ur.Role.RolePermissions)
        .Select(rp => rp.Permission)
        .Distinct()
        .ToListAsync();

    return permissions;
  }

  public async Task<bool> UserHasPermissionAsync(int userId, string permissionName)
  {
    int count = await _context.UserRoles
        .Where(ur => ur.UserId == userId)
        .SelectMany(ur => ur.Role.RolePermissions)
        .CountAsync(rp => rp.Permission.Name == permissionName);

    return count > 0;
  }

  public async Task<bool> UserHasRoleAsync(int userId, string roleName)
  {
    int count = await _context.Roles
        .Join(_context.UserRoles,
              r => r.Id, ur => ur.RoleId,
              (r, ur) => new { r, ur })
        .Where(x => x.ur.UserId == userId && x.r.NameRole == roleName)
        .CountAsync();

    return count > 0;
  }

  public async Task<UserRolesAndPermissions> GetUserRolesAndPermissionsAsync(int userId)
  {
    var userRoles = await _context.UserRoles
        .Where(ur => ur.UserId == userId)
        .Select(ur => new
        {
          RoleId = ur.Role.Id,
          RoleName = ur.Role.NameRole,
          RoleDescription = ur.Role.Description,
          Permissions = ur.Role.RolePermissions.Select(rp => new
          {
            PermissionId = rp.Permission.Id,
            PermissionName = rp.Permission.Name,
            PermissionDescription = rp.Permission.Description
          })
        })
        .ToListAsync();

    var roles = userRoles.Select(ur => new Role
    {
      Id = ur.RoleId,
      NameRole = ur.RoleName,
      Description = ur.RoleDescription
    }).DistinctBy(r => r.Id).ToList();

    var allPermissions = userRoles
        .SelectMany(ur => ur.Permissions)
        .Select(p => new Permission
        {
          Id = p.PermissionId,
          Name = p.PermissionName,
          Description = p.PermissionDescription
        })
        .DistinctBy(p => p.Id)
        .ToList();

    return new UserRolesAndPermissions
    {
      Roles = roles,
      Permissions = allPermissions
    };
  }

}
