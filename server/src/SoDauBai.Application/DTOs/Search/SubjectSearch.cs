using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class SubjectSearch : QueryObject
{
  public int? GradeId { get; set; } = null;
}

