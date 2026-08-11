using System;
using System.Collections.Generic;

namespace server.Models;

public partial class SubjectAssignment
{
    public int Id { get; set; }

    public int TeacherId { get; set; }

    public int SubjectId { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? Deleted { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Subject Subject { get; set; } = null!;

    public virtual Teacher Teacher { get; set; } = null!;

    public virtual User? UpdatedByNavigation { get; set; }
}
