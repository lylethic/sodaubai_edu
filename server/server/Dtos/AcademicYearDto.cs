namespace server.Dtos
{
  public class AcademicYearDto
  {
    public int AcademicYearId { get; set; }

    public string DisplayAcademicYearName { get; set; } = null!;

    public DateTime? YearStart { get; set; }

    public DateTime? YearEnd { get; set; }

    public string? Description { get; set; }

    public bool Status { get; set; }
  }
}
