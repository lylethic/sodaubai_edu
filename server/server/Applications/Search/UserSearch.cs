using System;
using server.Dtos;

namespace server.Applications.Search;

public class UserSearch : QueryObject
{
  public int? SchoolId { get; set; } = null;
}
