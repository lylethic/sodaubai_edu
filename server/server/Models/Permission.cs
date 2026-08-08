namespace server.Models;

public partial class Permission : IBaseEntity
{
  public int Id { get; set; }
  public string Name { get; set; } = null!;
  public string? Description { get; set; }
  public DateTime? DateCreated { get; set; }
  public int? CreatedBy { get; set; }
  public DateTime? DateUpdated { get; set; }
  public int? UpdatedBy { get; set; }
  public bool Deleted { get; set; } = false;

  public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
  public virtual ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();
}
