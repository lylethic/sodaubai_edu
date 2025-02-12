using server.Dtos;

namespace server.Types.BiaSoDauBai
{
  public class BiaSoDauBaiRes
  {
    public int BiaSoDauBaiId { get; set; }

    public int SchoolId { get; set; }

    public int AcademicyearId { get; set; }

    public int ClassId { get; set; }

    public bool Status { get; set; }

    public string SchoolName { get; set; } = string.Empty;

    public string ClassName { get; set; } = string.Empty;

    public string NienKhoaName { get; set; } = string.Empty;

    public string? TenGiaoVienChuNhiem { get; set; } = string.Empty;

    public string DateCreated { get; set; } = string.Empty;

    public string DateUpdated { get; set; } = string.Empty;
  }

  public class BiaSoDauBaiSearchObject : QueryObject
  {
    public int? SchoolId { get; set; }
    public int? ClassId { get; set; }
  }
}
