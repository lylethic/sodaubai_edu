using System;
using Microsoft.AspNetCore.Mvc;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class GradeSearch : QueryObject
{
  [FromQuery(Name = "academicYearId")]
  public int? AcademicYearId { get; set; } = null;
}

