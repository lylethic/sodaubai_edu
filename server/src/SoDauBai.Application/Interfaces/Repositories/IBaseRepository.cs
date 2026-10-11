using SoDauBai.Application.DTOs;
using System.Threading.Tasks;

namespace SoDauBai.Application.Interfaces.Repositories
{
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        Task<CursorPagedResult<TEntity>> GetPagedAsync(int? cursor, int limit = 20, string? searchTerm = null);
        Task<TEntity?> GetByIdAsync(int id);
        Task<TEntity> AddAsync(TEntity entity);
        Task<TEntity> UpdateAsync(TEntity entity);
        Task<bool> DeleteAsync(int id);
    }
}


