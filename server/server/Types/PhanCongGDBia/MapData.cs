using server.Dtos;

namespace server.Types.PhanCongGDBia
{
  public class MapData : PC_GiangDay_BiaSDBDto
  {
    public string? Fullname { get; set; } = string.Empty;
    public int? ClassId { get; set; }
    public string? ClassName { get; set; }
  }
}
