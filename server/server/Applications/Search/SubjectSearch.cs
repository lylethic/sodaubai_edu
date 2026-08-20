using System;
using server.Dtos;

namespace server.Applications.Search;

public class SubjectSearch : QueryObject
{
  public int? GradeId { get; set; } = null;
}
