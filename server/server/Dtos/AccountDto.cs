namespace server.Dtos
{
  public class AccountDto
  {
    public int AccountId { get; set; }

    public int RoleId { get; set; }

    public int? SchoolId { get; set; }

    public string Email { get; set; } = null!;

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public TeacherDto? Teacher { get; set; }
  }

  public class AccountBody
  {
    public int AccountId { get; set; }

    public int RoleId { get; set; }

    public int? SchoolId { get; set; }

    public string Email { get; set; } = null!;

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}
