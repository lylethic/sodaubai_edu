using server.Dtos;

namespace server.Types.BiaSoDauBai
{
  public class BiaSoDauBaiResType : ModelResType
  {
    public int? TotalCount { get; set; } = 0;

    public List<BiaSoDauBaiDto>? ListBiaSoDauBaiDto { get; set; }
    public BiaSoDauBaiDto? BiaSoDauBaiDto { get; set; }
    public Models.BiaSoDauBai? BiaSoDauBai { get; set; }
    public List<Models.BiaSoDauBai>? BiaSoDauBaiList { get; set; }
    public BiaSoDauBaiRes? BiaSoDauBaiRes { get; set; }
    public List<BiaSoDauBaiRes> ListBiaSoDauBaiRes { get; set; } = [];


    public BiaSoDauBaiResType() { }

    public BiaSoDauBaiResType(int statusCode, string message)
    {
      StatusCode = statusCode;
      Message = message;
    }

    public BiaSoDauBaiResType(int statusCode, string message, BiaSoDauBaiDto biaSoDauBaiDto)
    {
      StatusCode = statusCode;
      Message = message;
      BiaSoDauBaiDto = biaSoDauBaiDto;
    }

    public BiaSoDauBaiResType(int statusCode, string message, List<Models.BiaSoDauBai> biaSoDauBai)
    {
      StatusCode = statusCode;
      Message = message;
      BiaSoDauBaiList = biaSoDauBai;
    }

    public BiaSoDauBaiResType(int statusCode, string message, BiaSoDauBaiRes biaSoDauBaiRes)
    {
      StatusCode = statusCode;
      Message = message;
      BiaSoDauBaiRes = biaSoDauBaiRes;
    }

    public BiaSoDauBaiResType(int statusCode, string message, List<BiaSoDauBaiRes> listBiaSoDauBaiRes, int? totalResults)
    {
      StatusCode = statusCode;
      Message = message;
      ListBiaSoDauBaiRes = listBiaSoDauBaiRes;
      this.TotalCount = totalResults;
    }

    public BiaSoDauBaiResType(int statusCode, string message, List<BiaSoDauBaiRes> listBiaSoDauBaiRes)
    {
      StatusCode = statusCode;
      Message = message;
      ListBiaSoDauBaiRes = listBiaSoDauBaiRes;
    }

    public BiaSoDauBaiResType(int statusCode, string message, List<BiaSoDauBaiDto> listBiaSoDauBaiDto)
    {
      StatusCode = statusCode;
      Message = message;
      ListBiaSoDauBaiDto = listBiaSoDauBaiDto;
    }
  }
}
