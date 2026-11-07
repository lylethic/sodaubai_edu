using SoDauBai.Application.DTOs;

namespace SoDauBai.Application.DTOs.Types.ChiTietSoDauBai
{
  public class ChiTietBody : ChiTietSoDauBaiDto
  {
    public string? TenLop { get; set; }
    public string? HocKy { get; set; }
    public string? TenTuanHoc { get; set; }
    public string? MonHoc { get; set; }
    public string? XepLoai { get; set; }
  }
}

