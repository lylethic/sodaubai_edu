using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Account
{
    public int AccountId { get; set; }

    public int RoleId { get; set; }

    public int? SchoolId { get; set; }

    public string Email { get; set; } = null!;

    public byte[] MatKhau { get; set; } = null!;

    public byte[] PasswordSalt { get; set; } = null!;

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual School? School { get; set; }
}
