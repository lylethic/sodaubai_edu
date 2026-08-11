namespace server.Dtos
{
  public class SchoolDto
  {
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string SchoolType { get; set; } = "công lập";

    public string? Description { get; set; }

    public int? Level { get; set; } = 0;
  }

  public class ExtendSchool
  {
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public string SchoolType { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? Deleted { get; set; } = false;

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public int Level { get; set; }
  }
  public class SchoolDetail : SchoolDto
  {
    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}
