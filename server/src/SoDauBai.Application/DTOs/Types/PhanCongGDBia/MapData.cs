using SoDauBai.Application.DTOs;

namespace SoDauBai.Application.DTOs.Types.PhanCongGDBia
{
  public class MapData : PC_GiangDay_BiaSDBDto
  {
    public string? Fullname { get; set; } = string.Empty;
    public string? TeacherName { get => Fullname; set => Fullname = value; }
    public int? ClassId { get; set; }
    public string? ClassName { get; set; }
  }
}

