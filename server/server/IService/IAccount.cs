using server.Dtos;
using server.Types.Account;

namespace server.IService
{
  public interface IAccount
  {
    Task<int> GetCountAccounts();

    Task<int> GetCountAccountsBySchool(int schoolId);

    Task<AccountsResType> GetAccounts(int? schoolId);

    Task<AccountsResType> GetAccountsByRole(int? roleId, int? schoolId);

    Task<AccountsResType> GetAccount(int id);

    Task<AccountsResType> GetAccountById(int id);

    Task<AccountsResType> CreateAccount(RegisterDto model);

    Task<AccountsResType> UpdateAccount(int accountId, AccountBody model);

    Task<AccountsResType> DeleteAccount(int id);

    Task<AccountsResType> ImportExcel(IFormFile file);

    Task<AccountsResType> BulkDelete(List<int> ids);

    Task<AccountsResType> GetAccountsBySchoolId(QueryObjects? queryObject);

    Task<AccountsResType> RelativeSearchAccounts(QueryObjects? queryObject);
  }
}
