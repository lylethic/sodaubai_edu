using System;

namespace SoDauBai.Application.DTOs
{
  public partial class WeekDto
  {
    public int Id { get => WeekId; set => WeekId = value; }
    public int WeekId { get; set; }

    public int SemesterId { get; set; }

    public string? Name { get => WeekName; set => WeekName = value ?? string.Empty; }
    public string WeekName { get; set; } = string.Empty;

    public DateTime? WeekStart { get; set; }

    public DateTime? WeekEnd { get; set; }

    public bool Status { get; set; }
  }

  public class ExtendWeek
  {
    public int Id { get; set; }
    public int WeekId { get => Id; set => Id = value; }

    public int SemesterId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string WeekName { get => Name; set => Name = value; }

    public DateTime? WeekStart { get; set; }

    public DateTime? WeekEnd { get; set; }

    public bool Status { get; set; }

    public ExtendSemester? ExtendSemester { get; set; } = null;
  }
}


