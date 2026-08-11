using System;
using System.Collections.Generic;

namespace server.Models;

public partial class ChiTietSoDauBai
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

    public bool? Deleted { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual BiaSoDauBai BiaSoDauBai { get; set; } = null!;

    public virtual Classification Classification { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Semester Semester { get; set; } = null!;

    public virtual Subject Subject { get; set; } = null!;

    public virtual User? UpdatedByNavigation { get; set; }

    public virtual Week Week { get; set; } = null!;
}
