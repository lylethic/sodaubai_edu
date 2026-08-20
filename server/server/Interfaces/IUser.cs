using server.Models;
using server.Applications.ResponseModel;
using server.Dtos;
using server.Applications.Search;

namespace server.Interfaces;

public interface IUser
{
  Task<PaginatedResponse<ExtendUserBody>> GetUsers(UserSearch request);
  Task<User?> GetUser(int id);
  Task<User> AddUser(UserCreateBody model);
  Task<User> UpdateUser(int id, User entity);
  Task<bool> DeleteUser(int id);
  Task<User> UploadImageAsync(int id, IFormFile file);
}
