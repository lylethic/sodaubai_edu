using System;
using Microsoft.AspNetCore.Mvc;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class ClassSearch : QueryObject
{
  [FromQuery(Name = "gradeId")]
  public int? GradeId { get; set; }

  [FromQuery(Name = "teacherId")]
  public int? TeacherId { get; set; }

  [FromQuery(Name = "academicYearId")]
  public int? AcademicYearId { get; set; }

  [FromQuery(Name = "schoolId")]
  public int? SchoolId { get; set; }

  [FromQuery(Name = "level")]
  public int? Level { get; set; } = null;
}

