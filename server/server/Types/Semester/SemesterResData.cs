namespace server.Types.Semester
{
  public class SemesterResData
  {
    public int SemesterId { get; set; }

    public int AcademicYearId { get; set; }

    public string SemesterName { get; set; } = null!;

    public DateTime? DateStart { get; set; }

    public DateTime? DateEnd { get; set; }
    public bool Status { get; set; }

    public string? Description { get; set; }

    public string? DisplayAcademicYearName { get; set; } = null;

    public DateTime? YearStart { get; set; }

    public DateTime? YearEnd { get; set; }
  }
}
