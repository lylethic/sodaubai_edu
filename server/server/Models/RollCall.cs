using System;
using System.Collections.Generic;

namespace server.Models;

public partial class RollCall
{
    public int RollCallId { get; set; }

    public int ClassId { get; set; }

    public int WeekId { get; set; }

    public string? DayOfTheWeek { get; set; }

    public DateTime? DateAt { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? NumberOfAttendants { get; set; }

    public virtual Class Class { get; set; } = null!;

    public virtual ICollection<RollCallDetail> RollCallDetails { get; set; } = new List<RollCallDetail>();

    public virtual Week Week { get; set; } = null!;
}
