namespace server.Models;

public partial class Grade : IBaseEntity
{
  public int Id { get; set; }
  public int AcademicYearId { get; set; }
  public string Name { get; set; } = null!;
  public string? Description { get; set; }
  public DateTime? DateCreated { get; set; }
  public DateTime? DateUpdated { get; set; }
  public int CreatedBy { get; set; }
  public int? UpdatedBy { get; set; }
  public bool Deleted { get; set; } = false;

  public virtual AcademicYear AcademicYear { get; set; } = null!;
  public virtual ICollection<Class> Classes { get; set; } = new List<Class>();
  public virtual ICollection<Student> Students { get; set; } = new List<Student>();
  public virtual ICollection<Subject> Subjects { get; set; } = new List<Subject>();
  public virtual User? CreatedByNavigation { get; set; }
  public virtual User? UpdatedByNavigation { get; set; }
}
