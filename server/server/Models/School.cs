using System;
using System.Collections.Generic;

namespace server.Models;

public partial class School : IBaseEntity
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

  public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();

  public virtual ICollection<BiaSoDauBai> BiaSoDauBais { get; set; } = new List<BiaSoDauBai>();

  public virtual ICollection<Class> Classes { get; set; } = new List<Class>();

  public virtual User? CreatedByNavigation { get; set; }

  public virtual ICollection<Teacher> Teachers { get; set; } = new List<Teacher>();

  public virtual User? UpdatedByNavigation { get; set; }

  public virtual ICollection<User> Users { get; set; } = new List<User>();
}
