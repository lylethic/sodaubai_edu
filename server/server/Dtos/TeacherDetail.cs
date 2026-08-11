namespace server.Dtos;

public partial class TeacherDetail
{
  public int Id { get; set; }

  public int UserId { get; set; }

  public int SchoolId { get; set; }

  public string Fullname { get; set; } = null!;

  public DateTime DateOfBirth { get; set; }

  public string Gender { get; set; } = "Nam";

  public string Address { get; set; } = null!;

  public bool Status { get; set; }

  public DateTime DateCreated { get; set; }

  public DateTime DateUpdated { get; set; }

  public string? NameSchool { get; set; }

  public string SchoolType { get; set; } = string.Empty;
  public string? PhotoPath { get; set; }
}
