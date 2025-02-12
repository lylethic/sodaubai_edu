namespace server.Dtos;

public partial class TeacherDetail
{
  public int TeacherId { get; set; }

  public int AccountId { get; set; }

  public int SchoolId { get; set; }

  public string Fullname { get; set; } = null!;

  public string DateOfBirth { get; set; } = string.Empty;

  public string Gender { get; set; } = "Nam";

  public string Address { get; set; } = null!;

  public bool Status { get; set; }

  public string DateCreate { get; set; } = string.Empty;

  public string DateUpdate { get; set; } = string.Empty;

  public string? NameSchool { get; set; }

  public string SchoolType { get; set; }
  public string? PhotoPath { get; set; }
}
