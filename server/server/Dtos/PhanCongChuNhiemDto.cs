namespace server.Dtos
{
  public class PhanCongChuNhiemDto
  {
    public int Id { get; set; }
    public int TeacherId { get; set; }
    public int ClassId { get; set; }
    public int AcademicYearId { get; set; }
    public bool Status { get; set; }
    public string? Description { get; set; }
    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
  }

  public class ExtendPhanCongChuNhiem
  {
    public int Id { get; set; }

    public int TeacherId { get; set; }

    public int ClassId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public string? Description { get; set; }

    public int? AcademicYearId { get; set; }

    public ExtendAcademicYear? ExtendAcademicYear { get; set; } = null;

    public ExtendClass? ExtendClass { get; set; } = null;

    public ExtendTeacher? ExtendTeacher { get; set; } = null;

    public ExtendSchool? ExtendSchool { get; set; } = null;
  }
}
