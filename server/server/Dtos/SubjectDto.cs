namespace server.Dtos
{
  public class SubjectDto
  {
    public int SubjectId { get; set; }

    public string? SubjectName { get; set; } = null!;

    public bool Status { get; set; }

    public int? GradeId { get; set; }
  }

  public class SubjectRes
  {
    public int SubjectId { get; set; }

    public string? SubjectName { get; set; } = null!;

    public bool Status { get; set; }

    public int? GradeId { get; set; }

    public string? GradeName { get; set; } = null!;

    public string? DisplayAcademicYear_Name { get; set; } = null!;

    public string? YearStart { get; set; }
    public string? YearEnd { get; set; }
  }
}
