namespace SoDauBai.Application.DTOs
{
  public partial class WeeklyEvaluationDto
  {
    public int Id { get => WeeklyEvaluationId; set => WeeklyEvaluationId = value; }
    public int WeeklyEvaluationId { get; set; }

    public int ClassId { get; set; }

    public int TeacherId { get; set; }

    public int WeekId { get; set; }

    public string? Name { get => WeekNameEvaluation; set => WeekNameEvaluation = value ?? string.Empty; }
    public string WeekNameEvaluation { get; set; } = string.Empty;

    public double TotalScore { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
  }
}


