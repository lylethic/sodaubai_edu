using server.Models;
using server.Applications.ResponseModel;
using server.Dtos;
using System.Threading.Tasks;

namespace server.Interfaces;

public interface IPermission
{
  Task<PaginatedResponse<Permission>> GetPermissions(QueryObject request);
  Task<Permission?> GetPermission(int id);
  Task<Permission> AddPermission(Permission entity);
  Task<Permission> UpdatePermission(Permission entity);
  Task<bool> DeletePermission(int id);
}
