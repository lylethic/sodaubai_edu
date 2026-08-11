using server.Dtos;

namespace server.Types.ChiTietSoDauBai
{
  public class ChiTietSoDauBaiRes
  {

    public int Id { get; set; }

    public int BiaSoDauBaiId { get; set; }
    public string? ClassName { get; set; } = string.Empty; // sodaubai cua lop nao?

    // Hoc ky
    public int SemesterId { get; set; }
    public string SemesterName { get; set; } = string.Empty;

    // Tuan may?
    public int WeekId { get; set; }
    public string? WeekName { get; set; } = string.Empty;

    // Ten mon hoc
    public int SubjectId { get; set; }
    public string? SubjectName { get; set; }

    // Ten xep loai
    public int ClassificationId { get; set; }
    public string? ClassifyName { get; set; } = string.Empty;

    public string DaysOfTheWeek { get; set; } = null!;

    public string? Time { get; set; } = string.Empty;

    public string Session { get; set; } = null!;

    public int Period { get; set; }

    public string LessonContent { get; set; } = null!;

    public int Attend { get; set; }

    public string? Note { get; set; }

    public string? CreatedBy { get; set; } = string.Empty;

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}
