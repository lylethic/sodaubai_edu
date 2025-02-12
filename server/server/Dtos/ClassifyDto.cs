namespace server.Dtos
{
  public class ClassifyDto
  {
    public int ClassificationId { get; set; }

    public string ClassifyName { get; set; } = null!;

    public int? Score { get; set; }
  }
}
