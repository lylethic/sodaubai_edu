using server.Dtos;
using server.Types.Account;

namespace server.IService
{
  public interface IAccount
  {
    Task<int> GetCountAccounts();

    Task<int> GetCountAccountsBySchool(int schoolId);

    Task<AccountsResType> GetAllAsync(int? schoolId);

    Task<AccountsResType> GetAllByRoleAsync(int? roleId, int? schoolId);

    Task<AccountsResType> GetAsync(int id);

    Task<AccountsResType> GetByIdForUpdate(int id);

    Task<AccountsResType> CreateAsync(CreateAccountDto item);

    Task<AccountsResType> UpdateAsync(int id, UpdateAccountDto item);

    Task<AccountsResType> DeleteAsync(int id);

    Task<AccountsResType> ImportExcelAsync(IFormFile file);

    Task<AccountsResType> BulkDeleteAsync(List<int> ids);

    Task<AccountsResType> GetBySchoolIdAsync(QueryObjects? queryObject);

    Task<AccountsResType> RelativeSearchAsync(QueryObjects? queryObject);
  }
}
