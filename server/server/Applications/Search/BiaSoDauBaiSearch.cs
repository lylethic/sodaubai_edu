using System;
using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;
using server.Dtos;

namespace server.Applications.Search;


public class BiaSoDauBaiSearch : QueryObject
{
  [FromQuery(Name = "schoolId")]
  public int? SchoolId { get; set; } = null;

  [FromQuery(Name = "classId")]
  public int? ClassId { get; set; } = null;

  [FromQuery(Name = "academicyearId")]
  public int? AcademicyearId { get; set; } = null;

  [FromQuery(Name = "status")]
  [DefaultValue(true)]
  public bool? Status { get; set; } = true;
}
