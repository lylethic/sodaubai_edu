namespace server.Types.Auth
{
  public class LoginResData
  {
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime ExpiresAt { get; set; }
    public AccountData? Account { get; set; }
  }
}
