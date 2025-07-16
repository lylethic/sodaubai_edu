namespace server.Application.Dtos
{
  public class RollCallDetailDto
  {
    public int RollCallDetailId { get; set; }

    public int? RollCallId { get; set; }

    public int StudentId { get; set; }

    public bool IsExecute { get; set; }

    public string? Description { get; set; }
  }
}
