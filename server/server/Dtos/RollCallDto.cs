namespace server.Dtos
{
  public partial class RollCallDto
  {
    public int CallRollId { get; set; }

    public int ClassId { get; set; }

    public int WeekId { get; set; }

    public string? DayOfTheWeek { get; set; }

    public int? NumberOfAttendants { get; set; }

    public DateTime? DateAt { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}
