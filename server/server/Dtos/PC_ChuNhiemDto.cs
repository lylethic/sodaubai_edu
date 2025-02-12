namespace server.Dtos
{
  public class PC_ChuNhiemDto
  {
    public int PhanCongChuNhiemId { get; set; }
    public int TeacherId { get; set; }
    public int ClassId { get; set; }
    public int AcademicYearId { get; set; }
    public bool Status { get; set; }
    public string? Description { get; set; }
    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
  }
}
