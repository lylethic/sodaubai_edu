using System;
using System.Collections.Generic;

namespace server.Models;

public partial class BiaSoDauBai : IBaseEntity
{
    public int Id { get; set; }

    public int SchoolId { get; set; }

    public int AcademicyearId { get; set; }

    public int ClassId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? Deleted { get; set; }

    public int? UpdatedBy { get; set; }

    public int? CreatedBy { get; set; }

    public virtual AcademicYear Academicyear { get; set; } = null!;

    public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBais { get; set; } = new List<ChiTietSoDauBai>();

    public virtual Class Class { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<PhanCongGiangDay> PhanCongGiangDays { get; set; } = new List<PhanCongGiangDay>();

    public virtual School School { get; set; } = null!;

    public virtual User? UpdatedByNavigation { get; set; }
}
