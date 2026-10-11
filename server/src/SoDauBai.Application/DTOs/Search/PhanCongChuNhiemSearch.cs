using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class PhanCongChuNhiemSearch : QueryObject
{
  public int? SchoolId { get; set; } = null;
  public int? TeacherId { get; set; } = null;
  public int? ClassId { get; set; } = null;
  public int? AcademicYearId { get; set; } = null;
}

