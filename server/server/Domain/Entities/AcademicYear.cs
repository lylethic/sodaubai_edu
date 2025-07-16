namespace server.Domain.Entities;

public partial class AcademicYear
{
    public int AcademicYearId { get; set; }

    public string DisplayAcademicYearName { get; set; } = null!;

    public DateTime? YearStart { get; set; }

    public DateTime? YearEnd { get; set; }

    public string? Description { get; set; }

    public bool Status { get; set; }

    public virtual ICollection<BiaSoDauBai> BiaSoDauBais { get; set; } = [];

    public virtual ICollection<Class> Classes { get; set; } = [];

    public virtual ICollection<Grade> Grades { get; set; } = [];

    public virtual ICollection<PhanCongChuNhiem> PhanCongChuNhiems { get; set; } = [];

    public virtual ICollection<Semester> Semesters { get; set; } = [];
}
