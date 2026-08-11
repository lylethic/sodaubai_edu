using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models;

public partial class UserRole : IBaseEntity
{
  [NotMapped]
  public int Id { get; set; }

  public int RoleId { get; set; }

  public int UserId { get; set; }

  public DateTime? DateCreated { get; set; }

  public bool? Deleted { get; set; } = false;

  public DateTime? DateUpdated { get; set; }

  public virtual Role Role { get; set; } = null!;

  public virtual User User { get; set; } = null!;
}
