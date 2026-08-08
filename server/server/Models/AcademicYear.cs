using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public partial class AcademicYear : IBaseEntity
{
  public int Id { get; set; }

  public string Name { get; set; } = null!;

  public DateTime? YearStart { get; set; }

  public DateTime? YearEnd { get; set; }

  public string? Description { get; set; }

  public bool Status { get; set; }

  public bool Deleted { get; set; } = false;

  public DateTime? DateCreated { get; set; }

  public DateTime? DateUpdated { get; set; }

  public string DisplayAcademicYearName => $"{YearStart?.Year} - {YearEnd?.Year}";

  public virtual ICollection<BiaSoDauBai> BiaSoDauBais { get; set; } = new List<BiaSoDauBai>();

  public virtual ICollection<Class> Classes { get; set; } = new List<Class>();

  public virtual ICollection<Grade> Grades { get; set; } = new List<Grade>();

  public virtual ICollection<PhanCongChuNhiem> PhanCongChuNhiems { get; set; } = new List<PhanCongChuNhiem>();

  public virtual ICollection<Semester> Semesters { get; set; } = new List<Semester>();
}
