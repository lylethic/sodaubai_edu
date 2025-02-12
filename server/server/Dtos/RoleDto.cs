namespace server.Dtos
{
  public class RoleDto
  {
    public int RoleId { get; set; }

    public string NameRole { get; set; } = null!;

    public string Description { get; set; } = null!;

    //public DateTime? DateCreated { get; set; }
    //public DateTime? DateUpdated { get; set; }

    public RoleDto() { }
  }
}
