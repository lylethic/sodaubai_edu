namespace server.Dtos
{
  public class BiaSoDauBaiDto
  {
    public int Id { get; set; }

    public int SchoolId { get; set; }

    public int AcademicyearId { get; set; }

    public int ClassId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }

  public class ExtendBiaSoDauBai
  {
    public int Id { get; set; }

    public int SchoolId { get; set; }

    public int AcademicyearId { get; set; }

    public int ClassId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? Deleted { get; set; }

    public int? UpdatedBy { get; set; }

    public int? CreatedBy { get; set; }
    public ExtendAcademicYear? ExtendAcademicYear { get; set; } = null;
    public ExtendSchool? ExtendSchool { get; set; } = null;
    public ExtendClass? ExtendClass { get; set; } = null;
  }
}
