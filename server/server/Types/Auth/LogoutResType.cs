namespace server.Types.Auth
{
  public class LogoutResType : ModelResType
  {
    public LogoutResType()
    {
    }

    public LogoutResType(int statusCode, bool isSuccess, string mess)
    {
      this.StatusCode = statusCode;
      this.IsSuccess = isSuccess;
      this.Message = mess;
    }
  }
}
