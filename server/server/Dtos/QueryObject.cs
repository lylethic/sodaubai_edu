using Microsoft.AspNetCore.Mvc;

namespace server.Dtos
{
  public class QueryObject
  {
    private int? _pageNumber;
    private int? _pageSize;
    public int PageNumber
    {
      get => _pageNumber ?? 1;
      set => _pageNumber = value;
    }
    public int PageSize
    {
      get => _pageSize > 100 ? 100 : (_pageSize ?? 20);
      set => _pageSize = value;
    }

    [FromQuery(Name = "keyword")]
    public string? Keyword { get; set; } = null;

    [FromQuery(Name = "gradeId")]
    public int? GradeId { get; set; }

    [FromQuery(Name = "teacherId")]
    public int? TeacherId { get; set; }

    [FromQuery(Name = "academicYearId")]
    public int? AcademicYearId { get; set; }

    [FromQuery(Name = "schoolId")]
    public int? SchoolId { get; set; }
  }
}
