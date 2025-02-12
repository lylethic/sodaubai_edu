using server.Dtos;
using server.Models;

namespace server.Types.School
{
  public class SchoolResType : ModelResType
  {
    public List<SchoolDto>? SchoolData { get; set; }
    public SchoolDto? SchoolById { get; set; }
    public List<Error>? Errors { get; set; }

    public List<SchoolDetail>? SchoolDetails { get; set; }

    public SchoolDetail? SchoolDetail { get; set; }

    public SchoolResType() { }

    public SchoolResType(int statusCode, string message)
    {
      this.StatusCode = statusCode;
      this.Message = message;
    }

    public SchoolResType(int statusCode, string message, List<SchoolDto> data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.SchoolData = data;
    }

    public SchoolResType(int statusCode, string message, SchoolDto data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.SchoolById = data;
    }

    public SchoolResType(int statusCode, string message, List<Error> error)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Errors = error;
    }

    public SchoolResType(int statusCode, string message, SchoolDetail data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.SchoolDetail = data;
    }

    public SchoolResType(int statusCode, string message, List<SchoolDetail> data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.SchoolDetails = data;
    }
  }
}
