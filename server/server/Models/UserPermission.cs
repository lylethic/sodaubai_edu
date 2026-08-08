namespace server.Models;

public partial class UserPermission : IBaseEntity
{
  public int Id { get; set; }
  public int UserId { get; set; }
  public int PermissionId { get; set; }
  public bool IsGranted { get; set; }
  public DateTime? DateCreated { get; set; }
  public DateTime? DateUpdated { get; set; }
  public bool Deleted { get; set; } = false;

  public virtual User User { get; set; } = null!;
  public virtual Permission Permission { get; set; } = null!;
}
