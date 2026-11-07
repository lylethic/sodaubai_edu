using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class MonthlyEvaluationSearch : QueryObject
{
  public int? MonthEvaluation { get; set; } = null;
  public int? WeeklyEvaluationId { get; set; } = null;
}

