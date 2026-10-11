using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class RollCallDetailSearch : QueryObject
{
  public int? RollCallId { get; set; } = null;
  public int? StudentId { get; set; } = null;
}

