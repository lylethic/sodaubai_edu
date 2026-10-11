using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class ChiTietSoDauBaiSearch : QueryObject
{
  public int? BiaSoDauBaiId { get; set; } = null;

  public int? SemesterId { get; set; } = null;

  public int? WeekId { get; set; } = null;

  public int? SubjectId { get; set; } = null;

  public int? ClassificationId { get; set; } = null;
}

