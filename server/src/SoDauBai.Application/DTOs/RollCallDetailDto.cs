namespace SoDauBai.Application.DTOs
{
  public class RollCallDetailDto
  {
    public int Id { get; set; }

    public int? RollCallId { get; set; }

    public int StudentId { get; set; }

    public bool IsExecute { get; set; }

    public string? Description { get; set; }
  }
}


