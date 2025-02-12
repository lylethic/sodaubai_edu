using System;
using System.Collections.Generic;

namespace server.Models;

public partial class SubjectAssignment
{
    public int SubjectAssignmentId { get; set; }

    public int TeacherId { get; set; }

    public int SubjectId { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public virtual Subject Subject { get; set; } = null!;

    public virtual Teacher Teacher { get; set; } = null!;
}
