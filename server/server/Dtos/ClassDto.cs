namespace server.Dtos
{
  public partial class ClassDto
  {
    public int Id { get; set; }

    public string? ClassName { get; set; } = null;

    public int GradeId { get; set; }

    public int TeacherId { get; set; }

    public int AcademicYearId { get; set; }

    public int SchoolId { get; set; }

    public bool Status { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }

  public partial class ClassDetails
  {
    public int ClassId { get; set; }

    public int GradeId { get; set; }

    public string? Name { get; set; } = null;

    public int TeacherId { get; set; }

    public string TeacherName { get; set; } = string.Empty;

    public int AcademicYearId { get; set; }

    public string NienKhoa { get; set; } = string.Empty;

    public int SchoolId { get; set; }

    public string SchoolName { get; set; } = string.Empty;
    public int SchoolLevel { get; set; }

    public string ClassName { get; set; } = null!;

    public bool Status { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; } = null;

    public DateTime? DateUpdated { get; set; } = null;
  }

  public class ExtendClass
  {
    public int Id { get; set; }

    public int GradeId { get; set; }

    public int TeacherId { get; set; }

    public int AcademicYearId { get; set; }

    public int SchoolId { get; set; }

    public string Name { get; set; } = null!;

    public bool Status { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? Quantity { get; set; }

    public bool? Deleted { get; set; }
  }
}
