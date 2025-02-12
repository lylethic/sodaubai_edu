using System;
using System.Collections.Generic;

namespace server.Models;

public partial class WeeklyEvaluation
{
    public int WeeklyEvaluationId { get; set; }

    public int? ClassId { get; set; }

    public int? TeacherId { get; set; }

    public int? WeekId { get; set; }

    public string? WeekNameEvaluation { get; set; }

    public double TotalScore { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Class? Class { get; set; }

    public virtual ICollection<MonthlyEvaluation> MonthlyEvaluations { get; set; } = new List<MonthlyEvaluation>();

    public virtual Teacher? Teacher { get; set; }

    public virtual Week? Week { get; set; }
}
