using server.Models;
using server.Applications.ResponseModel;
using server.Dtos;
using System.Threading.Tasks;

namespace server.Interfaces;

public interface IUserRole
{
    Task<PaginatedResponse<UserRole>> GetUserRoles(QueryObject request);
    Task<UserRole?> GetUserRole(int id);
    Task<UserRole> AddUserRole(UserRole entity);
    Task<UserRole> UpdateUserRole(UserRole entity);
    Task<bool> DeleteUserRole(int id);
}
