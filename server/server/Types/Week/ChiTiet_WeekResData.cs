namespace server.Types.Week;

public class ChiTiet_WeekResData
{
  public int ChiTietSoDauBaiId { get; set; }

  public int WeekId { get; set; }

  public string? WeekName { get; set; }

  public bool Status { get; set; }

  public int XepLoaiId { get; set; }

  public string? TenXepLoai { get; set; }

  public int? SoDiem { get; set; }
}
