using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Teacher
{
    public int TeacherId { get; set; }

    public int AccountId { get; set; }

    public int SchoolId { get; set; }

    public string Fullname { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public bool Gender { get; set; }

    public string Address { get; set; } = null!;

    public bool Status { get; set; }

    public DateTime? DateCreate { get; set; }

    public DateTime? DateUpdate { get; set; }

    public string? PhotoPath { get; set; }

    public virtual Account Account { get; set; } = null!;

    public virtual ICollection<Class> Classes { get; set; } = new List<Class>();

    public virtual ICollection<PhanCongChuNhiem> PhanCongChuNhiems { get; set; } = new List<PhanCongChuNhiem>();

    public virtual ICollection<PhanCongGiangDay> PhanCongGiangDays { get; set; } = new List<PhanCongGiangDay>();

    public virtual School School { get; set; } = null!;

    public virtual ICollection<SubjectAssignment> SubjectAssignments { get; set; } = new List<SubjectAssignment>();

    public virtual ICollection<WeeklyEvaluation> WeeklyEvaluations { get; set; } = new List<WeeklyEvaluation>();
}
