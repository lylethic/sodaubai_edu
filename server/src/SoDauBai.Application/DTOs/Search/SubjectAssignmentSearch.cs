using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class SubjectAssignmentSearch : QueryObject
{
  public int? TeacherId { get; set; } = null;
  public int? SubjectId { get; set; } = null;
}

