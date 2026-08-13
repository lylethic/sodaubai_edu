using System;
using server.Dtos;

namespace server.Applications.Search;

public class ChiTietSoDauBaiSearch : QueryObject
{
  public int? BiaSoDauBaiId { get; set; } = null;

  public int? SemesterId { get; set; } = null;

  public int? WeekId { get; set; } = null;

  public int? SubjectId { get; set; } = null;

  public int? ClassificationId { get; set; } = null;
}
