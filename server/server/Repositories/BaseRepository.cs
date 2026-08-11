using Microsoft.EntityFrameworkCore;
using server.Applications.ResponseModel;
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

    public virtual async Task<CursorPagedResult<TEntity>> GetPagedAsync(
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
          .Where(x => x.Deleted == false)
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

    public async virtual Task<PaginatedResponse<TEntity>> GetOffsetPagedAsync(int limit, int offset, string? searchTerm = null)
    {
      var query = _dbSet.AsNoTracking().AsQueryable();

      if (!string.IsNullOrWhiteSpace(searchTerm))
      {
        query = ApplySearchFilter(query, searchTerm);
      }

      var totalCount = await query.Where(x => x.Deleted == false).CountAsync();

      var data = await query
          .Where(x => x.Deleted == false)
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

    public virtual async Task<TEntity?> GetByIdAsync(int id)
    {
      return await _dbSet.FirstOrDefaultAsync(x => x.Id == id && x.Deleted == false);
    }

    public async Task<TEntity> AddAsync(TEntity entity)
    {
      entity.DateCreated = DateTime.UtcNow;
      entity.Deleted = false;
      await _dbSet.AddAsync(entity);
      await _context.SaveChangesAsync();
      return entity;
    }

    public virtual async Task<TEntity> UpdateAsync(TEntity entity)
    {
      _dbSet.Update(entity);
      await _context.SaveChangesAsync();
      return entity;
    }

    public virtual async Task<bool> DeleteAsync(int id)
    {
      var entity = await GetByIdAsync(id);
      if (entity == null)
        return false;

      _dbSet.Remove(entity);
      await _context.SaveChangesAsync();
      return true;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
      var entity = await GetByIdAsync(id);
      if (entity == null)
        return false;
      entity.Deleted = true;
      entity.DateUpdated = DateTime.UtcNow;
      _dbSet.Update(entity);
      await _context.SaveChangesAsync();
      return true;
    }

    public virtual async Task<bool> BulkDeleteAsync(List<int> ids)
    {
      if (ids is null || ids.Count == 0)
      {
        return false;
      }
      var entities = await _dbSet.Where(x => ids.Contains(x.Id)).ToListAsync();
      if (entities.Count == 0)
        return false;

      _dbSet.RemoveRange(entities);
      await _context.SaveChangesAsync();
      return true;
    }

    public virtual async Task<bool> SoftBulkDeleteAsync(List<int> ids)
    {
      if (ids is null || ids.Count == 0)
      {
        return false;
      }
      var entities = await _dbSet.Where(x => ids.Contains(x.Id)).ToListAsync();
      if (entities.Count == 0)
        return false;
      foreach (var entity in entities)
      {
        entity.Deleted = true;
        entity.DateUpdated = DateTime.UtcNow;
      }
      await _context.SaveChangesAsync();
      return true;
    }
  }
}