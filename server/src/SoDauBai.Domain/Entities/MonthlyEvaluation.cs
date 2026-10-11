using System;
using System.Collections.Generic;

namespace SoDauBai.Domain.Entities;

public partial class MonthlyEvaluation : IBaseEntity
{
    public int Id { get; set; }

    public int? MonthEvaluation { get; set; }

    public int? WeeklyEvaluationId { get; set; }

    public decimal? AvgScore { get; set; }

    public string? Description { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? Deleted { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual User? UpdatedByNavigation { get; set; }

    public virtual WeeklyEvaluation? WeeklyEvaluation { get; set; }
}

