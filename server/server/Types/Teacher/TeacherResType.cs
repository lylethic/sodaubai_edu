using server.Dtos;

namespace server.Types.Teacher
{
  public class TeacherResType : ModelResType
  {
    public int TotalCount { get; set; }

    public List<TeacherDetail>? TeacherListDetails { get; set; }
    public TeacherDetail? TeacherDetail { get; set; }

    public List<TeacherDto>? Datas { get; set; }
    public TeacherDto? Data { get; set; }

    public List<TeacherToUpdate>? TeacherToUpdates { get; set; }
    public TeacherToUpdate? TeacherToUpdate { get; set; }

    public TeacherResType() { }

    public TeacherResType(int statusCode, string message)
    {
      this.StatusCode = statusCode;
      this.Message = message;
    }

    public TeacherResType(int statusCode, string message, TeacherDto data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Data = data;
    }

    public TeacherResType(int statusCode, string message, List<TeacherDto> datas)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.Datas = datas;
    }

    public TeacherResType(int statusCode, string message, TeacherToUpdate data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.TeacherToUpdate = data;
    }

    public TeacherResType(int statusCode, string message, List<TeacherToUpdate> datas)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.TeacherToUpdates = datas;
    }

    public TeacherResType(int statusCode, string message, TeacherDetail data)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.TeacherDetail = data;
    }

    // Use for pagination
    public TeacherResType(int statusCode, string message, List<TeacherDetail> datas, int totalResults)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.TeacherListDetails = datas;
      this.TotalCount = totalResults;
    }

    public TeacherResType(int statusCode, string message, List<TeacherDetail> datas)
    {
      this.StatusCode = statusCode;
      this.Message = message;
      this.TeacherListDetails = datas;
    }
  }
}
