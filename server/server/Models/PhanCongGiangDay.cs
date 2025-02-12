using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhanCongGiangDay
{
    public int PhanCongGiangDayId { get; set; }

    public int BiaSoDauBaiId { get; set; }

    public int TeacherId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public virtual BiaSoDauBai BiaSoDauBai { get; set; } = null!;

    public virtual Teacher Teacher { get; set; } = null!;
}
