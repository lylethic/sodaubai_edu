using System;
using System.Collections.Generic;

namespace server.Models;

public partial class WeeklyEvaluation
{
    public int Id { get; set; }

    public int? ClassId { get; set; }

    public int? TeacherId { get; set; }

    public int? WeekId { get; set; }

    public string? Name { get; set; }

    public double TotalScore { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? Deleted { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual Class? Class { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<MonthlyEvaluation> MonthlyEvaluations { get; set; } = new List<MonthlyEvaluation>();

    public virtual Teacher? Teacher { get; set; }

    public virtual User? UpdatedByNavigation { get; set; }

    public virtual Week? Week { get; set; }
}
