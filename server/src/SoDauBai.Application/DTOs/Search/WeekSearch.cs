using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class WeekSearch : QueryObject
{
  public int? SemesterId { get; set; } = null;
}

