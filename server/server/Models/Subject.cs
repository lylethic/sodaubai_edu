using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Subject
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public bool Status { get; set; }

    public int? GradeId { get; set; }

    public bool? Deleted { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBais { get; set; } = new List<ChiTietSoDauBai>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Grade? Grade { get; set; }

    public virtual ICollection<SubjectAssignment> SubjectAssignments { get; set; } = new List<SubjectAssignment>();

    public virtual User? UpdatedByNavigation { get; set; }
}
