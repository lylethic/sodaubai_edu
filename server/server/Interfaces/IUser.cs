using server.Models;
using server.Applications.ResponseModel;
using server.Dtos;
using System.Threading.Tasks;

namespace server.Interfaces;

public interface IUser
{
    Task<PaginatedResponse<User>> GetUsers(QueryObject request);
    Task<User?> GetUser(int id);
    Task<User> AddUser(User entity);
    Task<User> UpdateUser(User entity);
    Task<bool> DeleteUser(int id);
}
