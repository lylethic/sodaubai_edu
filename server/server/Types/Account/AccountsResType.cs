using server.Dtos;
using server.Models;

namespace server.Types.Account
{
  public class AccountsResType : ModelResType
  {
    public List<AccountsResData>? Data { get; set; }

    public List<AccountDto>? AccountDto { get; set; }

    public AccountDto? Account { get; set; }

    public AccountData? AccountData { get; set; }

    public AccountResData? AccountResData { get; set; }

    public List<AccountResData>? AccountsResData { get; set; }

    public AccountAddBody? AccountAddResType { get; set; }

    public List<Error>? Errors { get; set; }


    public AccountsResType() { }

    public AccountsResType(int statusCode, string message, List<AccountsResData> data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Data = data;
    }

    public AccountsResType(int statusCode, string message, List<AccountResData> data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.AccountsResData = data;
    }

    public AccountsResType(int statusCode, string message, AccountDto data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Account = data;
    }

    public AccountsResType(int statusCode, string message, AccountData data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.AccountData = data;
    }

    public AccountsResType(int statusCode, string message, List<AccountDto> data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.AccountDto = data;
    }

    public AccountsResType(int statusCode, string message)
    {
      this.StatusCode = statusCode;
      this.Message = message;
    }

    // Error validate
    public AccountsResType(bool isSuccess, int statusCode, string message, List<Error>? error)
    {
      this.Message = message;
      this.Errors = error;
      this.StatusCode = statusCode;
      this.IsSuccess = isSuccess;
    }

    public AccountsResType(int statusCode, string message, AccountAddBody data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.AccountAddResType = data;
    }


    public AccountsResType(int statusCode, string message, AccountResData data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.AccountResData = data;
    }
  }
}
