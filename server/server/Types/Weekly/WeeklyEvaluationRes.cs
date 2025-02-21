namespace server.Types.Weekly
{
  public partial class WeeklyEvaluationRes
  {
    public int WeeklyEvaluationId { get; set; }
    public int? ClassId { get; set; }
    public int? WeekId { get; set; }
    public int? TeacherId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public double TotalScore { get; set; }
  }
}
