namespace server.Dtos
{
  public partial class ClassDto
  {
    public int ClassId { get; set; }

    public int GradeId { get; set; }

    public int TeacherId { get; set; }

    public int AcademicYearId { get; set; }

    public int SchoolId { get; set; }

    public string ClassName { get; set; } = null!;

    public bool Status { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }

  public partial class ClassDetails
  {
    public int ClassId { get; set; }

    public int GradeId { get; set; }

    public string GradeName { get; set; } = string.Empty;

    public int TeacherId { get; set; }

    public string TeacherName { get; set; } = string.Empty;

    public int AcademicYearId { get; set; }

    public string NienKhoa { get; set; } = string.Empty;

    public int SchoolId { get; set; }

    public string SchoolName { get; set; } = string.Empty;

    public string ClassName { get; set; } = null!;

    public bool Status { get; set; }

    public string? Description { get; set; }

    public string DateCreated { get; set; } = string.Empty;

    public string DateUpdated { get; set; } = string.Empty;
  }

  public partial class ClassList : ClassDto
  {
    public new string? DateCreated { get; set; }

    public new string? DateUpdated { get; set; }
  }
}
