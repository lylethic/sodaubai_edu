using server.Data;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications.ResponseModel;
using Microsoft.EntityFrameworkCore;

namespace server.Repositories;

public class UserRepositories : BaseRepository<User>, IUser
{
  public UserRepositories(SoDauBaiContext context) : base(context)
  {
  }

  protected override IQueryable<User> ApplySearchFilter(IQueryable<User> query, string searchTerm)
  {
    query = query.Where(x => x.Deleted == false);
    if (string.IsNullOrWhiteSpace(searchTerm))
    {
      return query;
    }
    return query.Where(x => x.Email.Contains(searchTerm) || x.Username.Contains(searchTerm));
  }

  public async Task<PaginatedResponse<User>> GetUsers(QueryObject request)
  {
    var result = await GetOffsetPagedAsync(request.PageSize, (request.PageNumber - 1) * request.PageSize, request.Keyword);
    return new PaginatedResponse<User>
    {
      Items = result.Items,
      PageNumber = result.PageNumber,
      PageSize = result.PageSize,
      TotalCount = result.TotalCount
    };
  }

  public async Task<User?> GetUser(int id)
  {
    return await GetByIdAsync(id);
  }

  public async Task<User> AddUser(User entity)
  {
    return await AddAsync(entity);
  }

  public async Task<User> UpdateUser(User entity)
  {
    var existing = await GetByIdAsync(entity.Id);
    if (existing == null) throw new Exception("User not found");

    if (entity.SchoolId != null && entity.SchoolId != 0) existing.SchoolId = entity.SchoolId;
    if (!string.IsNullOrEmpty(entity.Email)) existing.Email = entity.Email;
    if (!string.IsNullOrEmpty(entity.Username)) existing.Username = entity.Username;
    if (!string.IsNullOrEmpty(entity.Avatar)) existing.Avatar = entity.Avatar;
    if (!string.IsNullOrEmpty(entity.PasswordHash)) existing.PasswordHash = entity.PasswordHash;

    existing.DateUpdated = DateTime.UtcNow;
    return await UpdateAsync(existing);
  }

  public async Task<bool> DeleteUser(int id)
  {
    return await SoftDeleteAsync(id);
  }

  public async Task<User?> GetUserByEmail(string email)
  {
    return await _dbSet.FirstOrDefaultAsync(x => x.Email == email && x.Deleted == false);
  }
}
