using server.Dtos;
using server.Models;

namespace server.Types.PhanCongGDBia
{
  public class PhanCongGiangDayBiaResType : ModelResType
  {
    public List<PhanCongGiangDay>? ListPhanCongGiangDaySoDauBai { get; set; }
    public List<PC_GiangDay_BiaSDBDto>? ListPhanCongGianghDayBia { get; set; }
    public PhanCongGiangDay? PhanCongGiangDayBiaSoDauBai { get; set; }
    public PC_GiangDay_BiaSDBDto? PhanCongGiangDayBia { get; set; }

    // Map with teacher and class
    public MapData? MapData { get; set; }
    public List<MapData>? ListMapData { get; set; }

    public PhanCongGiangDayBiaResType() { }

    public PhanCongGiangDayBiaResType(int statusCode, string message)
    {
      this.StatusCode = statusCode;
      this.Message = message;
    }

    public PhanCongGiangDayBiaResType(int statusCode, string message, PC_GiangDay_BiaSDBDto? phanCongGiangDay)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.PhanCongGiangDayBia = phanCongGiangDay;
    }

    public PhanCongGiangDayBiaResType(int statusCode, string message, List<PC_GiangDay_BiaSDBDto>? listPhanCongGiangDay)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListPhanCongGianghDayBia = listPhanCongGiangDay;
    }

    public PhanCongGiangDayBiaResType(int statusCode, string message, PhanCongGiangDay? phanCongGiangDaySoDauBai)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.PhanCongGiangDayBiaSoDauBai = phanCongGiangDaySoDauBai;
    }

    public PhanCongGiangDayBiaResType(int statusCode, string message, List<PhanCongGiangDay>? listPhanCongGiangDaySoDauBai)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListPhanCongGiangDaySoDauBai = listPhanCongGiangDaySoDauBai;
    }

    public PhanCongGiangDayBiaResType(int statusCode, string message, MapData? mapData)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.MapData = mapData;
    }

    public PhanCongGiangDayBiaResType(int statusCode, string message, List<MapData>? listMapData)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.ListMapData = listMapData;
    }
  }
}
