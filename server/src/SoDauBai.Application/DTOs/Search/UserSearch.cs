using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class UserSearch : QueryObject
{
  public int? SchoolId { get; set; } = null;
}

