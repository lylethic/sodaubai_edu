namespace server.Dtos
{
  public class SemesterDto
  {
    public int SemesterId { get; set; }

    public int AcademicYearId { get; set; }

    public string SemesterName { get; set; } = null!;

    public DateTime? DateStart { get; set; }

    public DateTime? DateEnd { get; set; }

    public string? Description { get; set; }

    public bool Status { get; set; }
  }
}
