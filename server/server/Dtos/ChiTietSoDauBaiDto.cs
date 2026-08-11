namespace server.Dtos
{
  public partial class ChiTietSoDauBaiDto
  {
    public int Id { get; set; }

    public int BiaSoDauBaiId { get; set; }

    public int SemesterId { get; set; }

    public int WeekId { get; set; }

    public int SubjectId { get; set; }

    public int ClassificationId { get; set; }

    public string DaysOfTheWeek { get; set; } = null!;

    public DateTime Time { get; set; }

    public string Session { get; set; } = null!;

    public int Period { get; set; }

    public string LessonContent { get; set; } = null!;

    public int Attend { get; set; }

    public string? Note { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}
