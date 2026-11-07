using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class RollCallSearch : QueryObject
{
  public int? ClassId { get; set; } = null;
  public int? WeekId { get; set; } = null;
}

