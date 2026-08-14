using server.Models;

namespace server.Dtos
{
  public class ClassificationDto
  {
    public string Name { get; set; } = null!;

    public decimal? Score { get; set; }
  }

  public class ExtendClassification
  {
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal? Score { get; set; }

    public bool? Deleted { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }
  }
}
