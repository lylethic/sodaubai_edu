using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhanCongChuNhiem
{
    public int Id { get; set; }

    public int TeacherId { get; set; }

    public int ClassId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public string? Description { get; set; }

    public int? AcademicYearId { get; set; }

    public bool? Deleted { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual AcademicYear? AcademicYear { get; set; }

    public virtual Class Class { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Teacher Teacher { get; set; } = null!;

    public virtual User? UpdatedByNavigation { get; set; }
}
