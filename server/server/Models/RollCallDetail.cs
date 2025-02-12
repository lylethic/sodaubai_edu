using System;
using System.Collections.Generic;

namespace server.Models;

public partial class RollCallDetail
{
    public int AbsenceId { get; set; }

    public int? RollCallId { get; set; }

    public int StudentId { get; set; }

    public bool IsExcused { get; set; }

    public string? Description { get; set; }

    public virtual RollCall? RollCall { get; set; }

    public virtual Student Student { get; set; } = null!;
}
