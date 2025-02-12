namespace server.Types.LopHoc
{
  public class ClassResData
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

    public string? SchoolName { get; set; }
  }
}
