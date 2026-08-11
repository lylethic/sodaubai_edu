using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Session
{
    public int Id { get; set; }

    public string Token { get; set; } = null!;

    public int UserId { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public DateTime? DateCreated { get; set; }
}
