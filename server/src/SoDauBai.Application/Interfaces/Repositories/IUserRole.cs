using SoDauBai.Domain.Entities;
using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using System.Threading.Tasks;

namespace SoDauBai.Application.Interfaces.Repositories;

public interface IUserRole
{
    Task<PaginatedResponse<UserRole>> GetUserRoles(QueryObject request);
    Task<UserRole?> GetUserRole(int id);
    Task<UserRole> AddUserRole(UserRole entity);
    Task<UserRole> UpdateUserRole(UserRole entity);
    Task<bool> DeleteUserRole(int id);
}

