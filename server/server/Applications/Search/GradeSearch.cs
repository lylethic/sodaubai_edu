using System;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;

namespace server.Applications.Search;

public class GradeSearch : QueryObject
{
  [FromQuery(Name = "academicYearId")]
  public int? AcademicYearId { get; set; } = null;
}
