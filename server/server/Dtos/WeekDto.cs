namespace server.Dtos
{
  public partial class WeekDto
  {
    public int WeekId { get; set; }

    public int SemesterId { get; set; }

    public string WeekName { get; set; } = null!;

    public DateTime? WeekStart { get; set; }

    public DateTime? WeekEnd { get; set; }

    public bool Status { get; set; }
  }

  public class ExtendWeek
  {
    public int Id { get; set; }

    public int SemesterId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? WeekStart { get; set; }

    public DateTime? WeekEnd { get; set; }

    public bool Status { get; set; }
  }
}
