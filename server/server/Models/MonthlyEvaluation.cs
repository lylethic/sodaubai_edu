using System;
using System.Collections.Generic;

namespace server.Models;

public partial class MonthlyEvaluation
{
    public int MonthlyEvaluationId { get; set; }

    public int? MonthEvaluation { get; set; }

    public int? WeeklyEvaluationId { get; set; }

    public decimal? AvgScore { get; set; }

    public string? Description { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual WeeklyEvaluation? WeeklyEvaluation { get; set; }
}
