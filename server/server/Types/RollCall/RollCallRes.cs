namespace server.Types.RollCall
{
  public class RollCallRes
  {
    public int RollCallId { get; set; }

    public int ClassId { get; set; }

    public string ClassName { get; set; } = string.Empty;

    public int WeekId { get; set; }

    public string WeekName { get; set; } = string.Empty;

    public string? DayOfTheWeek { get; set; }

    public DateTime? DateAt { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
    public int NumberOfAttendants { get; set; }
  }
}
