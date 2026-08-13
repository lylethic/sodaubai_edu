namespace server.Dtos
{
  public class ClassifyDto
  {
    public int ClassificationId { get; set; }

    public string ClassifyName { get; set; } = null!;

    public decimal? Score { get; set; }
  }

  public class ExtendClassify
  {
    public int ClassificationId { get; set; }

    public string ClassifyName { get; set; } = null!;

    public decimal? Score { get; set; }
  }
}
