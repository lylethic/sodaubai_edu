using server.Dtos;

namespace server.Types.Week
{
  public class WeekResType : ModelResType
  {
    public int StatusCode { get; set; } = 0;
    public List<SevenDaysInWeek>? Data { get; set; }

    public WeekResType(string message)
    {
      this.Message = message;
    }

    public WeekResType(int statusCode, string message)
    {
      this.StatusCode = statusCode;
      this.Message = message;
    }

    public WeekResType(int statusCode, string message, List<SevenDaysInWeek> data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Data = data;
    }
  }
}
