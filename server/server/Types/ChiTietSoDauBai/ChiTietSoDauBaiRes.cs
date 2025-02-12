using server.Dtos;

namespace server.Types.ChiTietSoDauBai
{
  public class ChiTietSoDauBaiRes
  {

    public int ChiTietSoDauBaiId { get; set; }

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

    public string? ThoiGian { get; set; } = string.Empty;

    public string BuoiHoc { get; set; } = null!;

    public int TietHoc { get; set; }

    public string LessonContent { get; set; } = null!;

    public int Attend { get; set; }

    public string? NoteComment { get; set; }

    public string? CreatedBy { get; set; } = string.Empty;

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
  }
}
