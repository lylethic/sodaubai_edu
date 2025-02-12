namespace server.Dtos
{
  public class MonthlyEvaluationDto
  {
    public int MonthlyEvaluationId { get; set; }

    public int WeeklyEvaluationId { get; set; }

    public int MonthEvaluation { get; set; }

    public decimal AvgScore { get; set; }

    public string? Description { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
  }
}
