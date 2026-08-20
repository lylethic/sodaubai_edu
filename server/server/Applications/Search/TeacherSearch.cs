using System;
using server.Dtos;

namespace server.Applications.Search;

public class TeacherSearch : QueryObject
{
  public int? SchoolId { get; set; } = null;
  public int? UserId { get; set; } = null;
}
