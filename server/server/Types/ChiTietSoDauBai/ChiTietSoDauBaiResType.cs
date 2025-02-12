using server.Dtos;
using server.Types.Week;

namespace server.Types.ChiTietSoDauBai
{
  public class ChiTietSoDauBaiResType : ModelResType
  {
    public ChiTietSoDauBaiDto? SoDauBaiDto { get; set; }

    public List<ChiTietSoDauBaiDto>? ListSoDauBaiDto { get; set; }

    public ChiTietAndBiaSoDauBaiRes? ChiTietAndBiaSoDauBaiRes { get; set; }

    public List<ChiTietAndBiaSoDauBaiRes>? ListChiTietAndBiaSoDauBaiRes { get; set; }

    public ChiTiet_WeekResData? ChiTiet_WeekResData { get; set; }

    public List<ChiTiet_WeekResData>? ListChiTiet_WeekResData { get; set; }

    public ChiTietSoDauBaiRes? ChiTietSDBResData { get; set; }

    public List<ChiTietSoDauBaiRes>? ListChiTietSoDauBaiRes { get; set; }

    public ChiTietBody? ChiTietBody { get; set; }

    public List<ChiTietBody>? ListChiTietBody { get; set; }

    public ChiTietSoDauBaiResType() { }

    public ChiTietSoDauBaiResType(int statusCode, string message)
    {
      this.StatusCode = statusCode;
      this.Message = message;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, ChiTietSoDauBaiDto soDauBaiDto)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.SoDauBaiDto = soDauBaiDto;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, List<ChiTietSoDauBaiDto> listSoDauBaiDto)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListSoDauBaiDto = listSoDauBaiDto;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, ChiTietAndBiaSoDauBaiRes chiTietBiaSoDauBaiRes)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ChiTietAndBiaSoDauBaiRes = chiTietBiaSoDauBaiRes;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, List<ChiTietAndBiaSoDauBaiRes> listChiTietBiaSoDauBaiRes)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListChiTietAndBiaSoDauBaiRes = listChiTietBiaSoDauBaiRes;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, ChiTiet_WeekResData chiTiet_WeekResData)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ChiTiet_WeekResData = chiTiet_WeekResData;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, List<ChiTiet_WeekResData> listChiTiet_WeekResData)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListChiTiet_WeekResData = listChiTiet_WeekResData;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, ChiTietSoDauBaiRes chiTietSDBResData)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ChiTietSDBResData = chiTietSDBResData;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, List<ChiTietSoDauBaiRes> data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListChiTietSoDauBaiRes = data;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, ChiTietBody chiTietBody)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ChiTietBody = chiTietBody;
    }

    public ChiTietSoDauBaiResType(int statusCode, string message, List<ChiTietBody> listChiTietBody)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListChiTietBody = listChiTietBody;
    }
  }
}
