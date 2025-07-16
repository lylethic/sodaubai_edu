namespace server.Application.Dtos
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

  public record AcademicYearCreateDto(string DisplayAcademicYearName, DateTime? YearStart, DateTime? YearEnd, string? Description, bool Status);

  public record AcademicYearUpdateDto(string DisplayAcademicYearName, DateTime? YearStart, DateTime? YearEnd, string? Description, bool Status);
}
