using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public partial class UserPermission : IBaseEntity
{
  [NotMapped]
  public int Id { get; set; }
  public int UserId { get; set; }

  public int PermissionId { get; set; }

  public bool IsGranted { get; set; }

  public DateTime? DateCreated { get; set; }
  [NotMapped]
  public DateTime? DateUpdated { get; set; }
  public bool? Deleted { get; set; } = false;

  public virtual Permission Permission { get; set; } = null!;

  public virtual User User { get; set; } = null!;
}
