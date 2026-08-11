using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Semester
{
    public int Id { get; set; }

    public int AcademicYearId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? DateStart { get; set; }

    public DateTime? DateEnd { get; set; }

    public string? Description { get; set; }

    public bool Status { get; set; }

    public bool? Deleted { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public virtual AcademicYear AcademicYear { get; set; } = null!;

    public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBais { get; set; } = new List<ChiTietSoDauBai>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? UpdatedByNavigation { get; set; }

    public virtual ICollection<Week> Weeks { get; set; } = new List<Week>();
}
