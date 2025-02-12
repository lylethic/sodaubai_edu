namespace server.Types.Account
{
  public class AccountAddBody
  {
    public int RoleId { get; set; }
    public int SchoolId { get; set; }
    public string Email { get; set; } = string.Empty;
    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }

    public AccountAddBody() { }
  }
}
