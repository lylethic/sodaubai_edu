using SoDauBai.Domain.Entities;
using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using System.Threading.Tasks;

namespace SoDauBai.Application.Interfaces.Repositories;

public interface IUserPermission
{
    Task<PaginatedResponse<UserPermission>> GetUserPermissions(QueryObject request);
    Task<UserPermission?> GetUserPermission(int id);
    Task<UserPermission> AddUserPermission(UserPermission entity);
    Task<UserPermission> UpdateUserPermission(UserPermission entity);
    Task<bool> DeleteUserPermission(int id);
}

