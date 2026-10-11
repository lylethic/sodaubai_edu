using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class StudentSearch : QueryObject
{
  public int? SchoolId { get; set; } = null;
  public int? ClassId { get; set; } = null;
  public int? GradeId { get; set; } = null;
}

