using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.Models;
using System.Linq;
using System.Threading.Tasks;

namespace server.Repositories
{
  public abstract class BaseRepository<TEntity> where TEntity : class, IBaseEntity
  {
    protected readonly SoDauBaiContext _context;
    protected readonly DbSet<TEntity> _dbSet;

    public BaseRepository(SoDauBaiContext context)
    {
      _context = context;
      _dbSet = context.Set<TEntity>();
    }

    public async Task<CursorPagedResult<TEntity>> GetPagedAsync(
       QueryRequest request)
    {
      var query = _dbSet.AsNoTracking().AsQueryable();

      if (!string.IsNullOrWhiteSpace(request.SearchTerm))
      {
        query = ApplySearchFilter(query, request.SearchTerm);
      }

      if (request.Cursor.HasValue && request.Cursor.Value > 0)
      {
        query = query.Where(x => x.Id > request.Cursor.Value);
      }

      var data = await query
          .OrderBy(x => x.Id)
          .Take(request.Limit + 1)
          .ToListAsync();

      var hasNextPage = data.Count > request.Limit;
      if (hasNextPage)
      {
        data.RemoveAt(request.Limit);
      }

      var nextCursor = data.Count > 0 ? data.Last().Id : (int?)null;

      return new CursorPagedResult<TEntity>
      {
        Data = data,
        NextCursor = hasNextPage ? nextCursor : null,
        HasNextPage = hasNextPage
      };
    }

    public async Task<PaginatedResponse<TEntity>> GetOffsetPagedAsync(int limit, int offset, string? searchTerm = null)
    {
      var query = _dbSet.AsNoTracking().AsQueryable();

      if (!string.IsNullOrWhiteSpace(searchTerm))
      {
        query = ApplySearchFilter(query, searchTerm);
      }

      var totalCount = await query.CountAsync();

      var data = await query
          .OrderBy(x => x.Id)
          .Skip(offset)
          .Take(limit)
          .ToListAsync();

      return new PaginatedResponse<TEntity>
      {
        Items = data,
        TotalCount = totalCount,
        PageNumber = limit > 0 ? (offset / limit) + 1 : 1,
        PageSize = limit
      };
    }

    protected virtual IQueryable<TEntity> ApplySearchFilter(IQueryable<TEntity> query, string searchTerm)
    {
      return query;
    }

    public async Task<TEntity?> GetByIdAsync(int id)
    {
      return await _dbSet.FindAsync(id);
    }

    public async Task<TEntity> AddAsync(TEntity entity)
    {
      await _dbSet.AddAsync(entity);
      await _context.SaveChangesAsync();
      return entity;
    }

    public async Task<TEntity> UpdateAsync(TEntity entity)
    {
      _dbSet.Update(entity);
      await _context.SaveChangesAsync();
      return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
      var entity = await GetByIdAsync(id);
      if (entity == null)
        return false;

      _dbSet.Remove(entity);
      await _context.SaveChangesAsync();
      return true;
    }
  }
}