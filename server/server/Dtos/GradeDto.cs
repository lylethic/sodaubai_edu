namespace server.Dtos
{
  public class GradeDto
  {
    public int Id { get; set; }

    public int AcademicYearId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }

  public class GradeDetail : GradeDto
  {
    public string DisplayAcademicYearName { get; set; } = null!;

    public DateTime? YearStart { get; set; }

    public DateTime? YearEnd { get; set; }
  }
}
