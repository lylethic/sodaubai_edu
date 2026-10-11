using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class WeeklyEvaluationSearch : QueryObject
{
  public int? ClassId { get; set; } = null;
  public int? WeekId { get; set; } = null;
  public int? TeacherId { get; set; } = null;
}

