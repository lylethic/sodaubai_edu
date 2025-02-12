namespace server.Dtos
{
  public partial class WeeklyEvaluationDto
  {
    public int WeeklyEvaluationId { get; set; }

    public int ClassId { get; set; }

    public int TeacherId { get; set; }

    public int WeekId { get; set; }

    public string WeekNameEvaluation { get; set; }

    public double TotalScore { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
  }
}
