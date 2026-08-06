using server.Models;
using server.Applications.ResponseModel;
using server.Dtos;
using System.Threading.Tasks;

namespace server.Interfaces;

public interface IUserPermission
{
    Task<PaginatedResponse<UserPermission>> GetUserPermissions(QueryObject request);
    Task<UserPermission?> GetUserPermission(int id);
    Task<UserPermission> AddUserPermission(UserPermission entity);
    Task<UserPermission> UpdateUserPermission(UserPermission entity);
    Task<bool> DeleteUserPermission(int id);
}
