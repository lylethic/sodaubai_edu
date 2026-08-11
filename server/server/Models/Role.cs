using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Role : IBaseEntity
{
  public int Id { get; set; }

  public string NameRole { get; set; } = null!;

  public string? Description { get; set; }

  public DateTime? DateCreated { get; set; }

  public DateTime? DateUpdated { get; set; }

  public int? CreatedBy { get; set; }

  public int? UpdatedBy { get; set; }

  public bool? Deleted { get; set; }

  public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();

  public virtual User? CreatedByNavigation { get; set; }

  public virtual ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

  public virtual User? UpdatedByNavigation { get; set; }

  public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
