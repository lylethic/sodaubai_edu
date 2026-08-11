using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Student
{
    public int Id { get; set; }

    public int ClassId { get; set; }

    public int GradeId { get; set; }

    public string Fullname { get; set; } = null!;

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public string? Description { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? Address { get; set; }

    public int? UserId { get; set; }

    public bool? Deleted { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual Class Class { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Grade Grade { get; set; } = null!;

    public virtual ICollection<RollCallDetail> RollCallDetails { get; set; } = new List<RollCallDetail>();

    public virtual User? UpdatedByNavigation { get; set; }

    public virtual User? User { get; set; }
}
