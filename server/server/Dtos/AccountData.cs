namespace server.Dtos
{
  public class AccountData
  {
    public int AccountId { get; set; }
    public int RoleId { get; set; }
    public int? SchoolId { get; set; }
    public string? Email { get; set; }
    public byte[]? Password { get; set; }
  }

  //public record AccountDto(int AccountId, int RoleId, int? SchoolId, string? Email, byte[]? Password);
  public record CreateAccountDto(int RoleId, int SchoolId, string Email, string Password, DateTime? DateCreated, DateTime? DateUpdated);
  public record UpdateAccountDto(int RoleId, int? SchoolId, string Email, DateTime? DateCreated, DateTime? DateUpdated);
}
