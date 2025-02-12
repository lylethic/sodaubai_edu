using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Week
{
    public int WeekId { get; set; }

    public int SemesterId { get; set; }

    public string WeekName { get; set; } = null!;

    public DateTime? WeekStart { get; set; }

    public DateTime? WeekEnd { get; set; }

    public bool Status { get; set; }

    public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBais { get; set; } = new List<ChiTietSoDauBai>();

    public virtual ICollection<RollCall> RollCalls { get; set; } = new List<RollCall>();

    public virtual Semester Semester { get; set; } = null!;

    public virtual ICollection<WeeklyEvaluation> WeeklyEvaluations { get; set; } = new List<WeeklyEvaluation>();
}
