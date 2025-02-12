namespace server.Dtos
{
  public partial class ChiTietSoDauBaiDto
  {
    public int ChiTietSoDauBaiId { get; set; }

    public int BiaSoDauBaiId { get; set; }

    public int SemesterId { get; set; }

    public int WeekId { get; set; }

    public int SubjectId { get; set; }

    public int ClassificationId { get; set; }

    public string DaysOfTheWeek { get; set; } = null!;

    public DateTime ThoiGian { get; set; }

    public string BuoiHoc { get; set; } = null!;

    public int TietHoc { get; set; }

    public string LessonContent { get; set; } = null!;

    public int Attend { get; set; }

    public string? NoteComment { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
  }
}
