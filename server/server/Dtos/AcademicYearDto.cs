namespace server.Dtos
{
  public class AcademicYearDto
  {
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? YearStart { get; set; }

    public DateTime? YearEnd { get; set; }

    public string? Description { get; set; }

    public bool Status { get; set; }
  }

  public record AcademicYearCreateDto(string DisplayAcademicYearName, DateTime? YearStart, DateTime? YearEnd, string? Description, bool Status);

  public record AcademicYearUpdateDto(string DisplayAcademicYearName, DateTime? YearStart, DateTime? YearEnd, string? Description, bool Status);
}
