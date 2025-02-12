namespace server.Dtos;

public class PhanCongData
{
  public int PhanCongChuNhiemId { get; set; }
  public int SchoolId { get; set; }
  public string SchoolName { get; set; } = string.Empty;
  public int TeacherId { get; set; }
  public string TeacherName { get; set; } = string.Empty;
  public int GradeId { get; set; }
  public int ClassId { get; set; }
  public string NameClass { get; set; } = string.Empty;
  public int AcademicYearId { get; set; }
  public string AcademicYearName { get; set; } = string.Empty;
  public string? Description { get; set; }
  public bool Status { get; set; }
  public DateTime? DateCreated { get; set; } = DateTime.UtcNow;
  public DateTime? DateUpdated { get; set; }
}
