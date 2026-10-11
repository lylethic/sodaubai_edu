using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class TeacherSearch : QueryObject
{
  public int? SchoolId { get; set; } = null;
  public int? UserId { get; set; } = null;
}

