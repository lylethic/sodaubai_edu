namespace server.Dtos
{
  public class SubjectDto
  {
    public int Id { get; set; }

    public string? Name { get; set; } = null!;

    public bool Status { get; set; }

    public int? GradeId { get; set; }
    public string? Description { get; set; } = null;
  }

  public class SubjectRes
  {
    public int Id { get; set; }

    public string? Name { get; set; } = null!;

    public bool Status { get; set; }

    public int? GradeId { get; set; }

    public string? GradeName { get; set; } = null!;

    public string? DisplayAcademicYear_Name { get; set; } = null!;
    public string? Description { get; set; } = null;
  }

  public class ExtendSubject
  {
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool Status { get; set; }

    public int? GradeId { get; set; }

    public string? Description { get; set; } = null;

    public ExtendGrade? ExtendGrade { get; set; } = null;
  }
}
