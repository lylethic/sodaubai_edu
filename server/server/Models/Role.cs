namespace server.Models;

public partial class Role : IBaseEntity
{
  public int Id { get; set; }
  public string NameRole { get; set; } = null!;
  public string Description { get; set; } = null!;
  public DateTime? DateCreated { get; set; }
  public DateTime? DateUpdated { get; set; }
  public int? CreatedBy { get; set; }
  public int? UpdatedBy { get; set; }
  public bool Deleted { get; set; } = false;

  public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
  public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
  public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
