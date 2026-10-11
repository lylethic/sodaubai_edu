using SoDauBai.Domain.Entities;
using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs;
using SoDauBai.Application.DTOs.Search;

namespace SoDauBai.Application.Interfaces.Repositories;

public interface IUser
{
    Task<PaginatedResponse<ExtendUserBody>> GetUsers(UserSearch request);
    Task<User?> GetUser(int id);
    Task<User> AddUser(UserCreateBody model);
    Task<User> UpdateUser(int id, User entity);
    Task<bool> DeleteUser(int id);
    Task<User> UploadImageAsync(int id, IFormFile file);
    Task<MyInfoDto?> GetUserByUsername(string username);
}

