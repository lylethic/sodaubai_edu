using System;
using System.Collections.Generic;

namespace server.Models;

public partial class RollCallDetail
{
    public int Id { get; set; }

    public int? RollCallId { get; set; }

    public int StudentId { get; set; }

    public bool IsExcused { get; set; }

    public string? Description { get; set; }

    public bool? Deleted { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual RollCall? RollCall { get; set; }

    public virtual Student Student { get; set; } = null!;

    public virtual User? UpdatedByNavigation { get; set; }
}
