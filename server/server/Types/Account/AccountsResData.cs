namespace server.Types.Account
{
  public class AccountsResData
  {
    public int AccountId { get; set; }
    public int? RoleId { get; set; }
    public int? SchoolId { get; set; }

    public string? RoleName { get; set; } = string.Empty;

    public string? SchoolName { get; set; } = string.Empty;

    public string? Email { get; set; } = string.Empty;

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}
