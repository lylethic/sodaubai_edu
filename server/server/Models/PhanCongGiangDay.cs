using System;
using System.Collections.Generic;

namespace server.Models;

public partial class PhanCongGiangDay
{
    public int Id { get; set; }

    public int BiaSoDauBaiId { get; set; }

    public int TeacherId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public bool? Deleted { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual BiaSoDauBai BiaSoDauBai { get; set; } = null!;

    public virtual User? CreatedByNavigation { get; set; }

    public virtual Teacher Teacher { get; set; } = null!;

    public virtual User? UpdatedByNavigation { get; set; }
}
