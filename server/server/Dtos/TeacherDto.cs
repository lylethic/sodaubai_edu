namespace server.Dtos
{
  public class TeacherDto
  {
    public int Id { get; set; }
    public int UserId { get; set; }
    public int SchoolId { get; set; }
    public string Fullname { get; set; } = null!;
    public DateTime DateOfBirth { get; set; }
    public bool Gender { get; set; }
    public string Address { get; set; } = null!;
    public bool Status { get; set; }
    public string? PhotoPath { get; set; }
    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
    public int CreatedBy { get; set; }
    public int UpdatedBy { get; set; }

    public ExtendSchool? ExtendSchool { get; set; } = null;
    public ExtendUser? ExtendUser { get; set; } = null;
  }

  public class TeacherCreateBody
  {
    public int UserId { get; set; }

    public int SchoolId { get; set; }

    public string Fullname { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public bool Gender { get; set; }

    public string? Address { get; set; } = null;

    public string? PhotoPath { get; set; } = null;
  }

  public class TeacherToUpdate
  {
    public int TeacherId { get; set; }

    public int UserId { get; set; }

    public int SchoolId { get; set; }

    public string Fullname { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public bool Gender { get; set; }

    public string Address { get; set; } = null!;

    public bool Status { get; set; }

    public DateTime? DateCreate { get; set; }

    public DateTime? DateUpdate { get; set; }

    public string? PhotoPath { get; set; }
  }

  public class ExtendTeacher
  {
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int SchoolId { get; set; }

    public string Fullname { get; set; } = null!;

    public DateTime DateOfBirth { get; set; }

    public bool Gender { get; set; }

    public string Address { get; set; } = null!;

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public string? PhotoPath { get; set; }
  }
}
