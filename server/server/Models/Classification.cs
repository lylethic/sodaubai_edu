using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Classification
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public decimal? Score { get; set; }

    public bool? Deleted { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }

    public int? CreatedBy { get; set; }

    public int? UpdatedBy { get; set; }

    public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBais { get; set; } = new List<ChiTietSoDauBai>();

    public virtual User? CreatedByNavigation { get; set; }

    public virtual User? UpdatedByNavigation { get; set; }
}
