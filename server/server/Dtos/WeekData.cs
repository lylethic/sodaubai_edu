using System;

namespace server.Dtos;

public class WeekData
{
  public int WeekId { get; set; }

  public string WeekName { get; set; } = null!;

  public string? WeekStart { get; set; }

  public string? WeekEnd { get; set; }

  public bool Status { get; set; }

  public int SemesterId { get; set; }

  public string SemesterName { get; set; } = null!;

  public string? DateStart { get; set; }

  public string? DateEnd { get; set; }
}
