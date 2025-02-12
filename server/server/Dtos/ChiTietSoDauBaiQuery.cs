namespace server.Dtos
{
  public class ChiTietSoDauBaiQuery
  {
    public int SchoolId { get; set; }
    public int AcademicYearId { get; set; }
    public int SemesterId { get; set; }
    public int WeekId { get; set; }
    public int BiaSoDauBaiId { get; set; }
  }

  public class ChiTietSoDauBaiByBiaQuery
  {
    public int AcademicYearId { get; set; }
    public int SemesterId { get; set; }
    public int WeekId { get; set; }
    public int BiaSoDauBaiId { get; set; }
  }
}