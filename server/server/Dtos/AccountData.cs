namespace server.Types
{
  public class AccountData
  {
    public int AccountId { get; set; }
    public int RoleId { get; set; }
    public int? SchoolId { get; set; }
    public string? Email { get; set; }
    public byte[]? Password { get; set; }
  }
}
