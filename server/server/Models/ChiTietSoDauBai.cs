using System;
using System.Collections.Generic;

namespace server.Models;

public partial class ChiTietSoDauBai
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

    public virtual BiaSoDauBai BiaSoDauBai { get; set; } = null!;

    public virtual Classification Classification { get; set; } = null!;

    public virtual Semester Semester { get; set; } = null!;

    public virtual Subject Subject { get; set; } = null!;

    public virtual Week Week { get; set; } = null!;
}
