using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Session
{
    public int TokenId { get; set; }

    public string Token { get; set; } = null!;

    public int AccountId { get; set; }

    public DateTime? ExpiresAt { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Account Account { get; set; } = null!;
}
