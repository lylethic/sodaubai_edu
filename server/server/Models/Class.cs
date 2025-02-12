using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Class
{
    public int ClassId { get; set; }

    public int GradeId { get; set; }

    public int TeacherId { get; set; }

    public int AcademicYearId { get; set; }

    public int SchoolId { get; set; }

    public string ClassName { get; set; } = null!;

    public bool Status { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? NumberOfAttendants { get; set; }

    public virtual AcademicYear AcademicYear { get; set; } = null!;

    public virtual ICollection<BiaSoDauBai> BiaSoDauBais { get; set; } = new List<BiaSoDauBai>();

    public virtual Grade Grade { get; set; } = null!;

    public virtual ICollection<PhanCongChuNhiem> PhanCongChuNhiems { get; set; } = new List<PhanCongChuNhiem>();

    public virtual ICollection<RollCall> RollCalls { get; set; } = new List<RollCall>();

    public virtual School School { get; set; } = null!;

    public virtual ICollection<Student> Students { get; set; } = new List<Student>();

    public virtual Teacher Teacher { get; set; } = null!;

    public virtual ICollection<WeeklyEvaluation> WeeklyEvaluations { get; set; } = new List<WeeklyEvaluation>();
}
