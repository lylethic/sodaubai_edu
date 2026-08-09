using server.Dtos;
using server.Models;

namespace server.Types.Grade
{
  public class GradeResType : ModelResType
  {
    public List<GradeDto>? GradeData { get; set; }

    public GradeDto? GradebyId { get; set; }

    public List<Error>? Errors { get; set; }
    public object? Data { get; set; }

    public GradeResType() { }

    public GradeResType(int statusCode, string message)
    {
      this.StatusCode = statusCode;
      this.Message = message;
    }

    public GradeResType(int statusCode, string message, object data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Data = data;
    }

    public GradeResType(int statusCode, string message, GradeDto data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.GradebyId = data;
    }

    public GradeResType(int statusCode, string message, List<Error> error)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Errors = error;
    }
  }
}
