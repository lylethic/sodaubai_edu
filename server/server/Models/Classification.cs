using System;
using System.Collections.Generic;

namespace server.Models;

public partial class Classification
{
    public int ClassificationId { get; set; }

    public string ClassifyName { get; set; } = null!;

    public int? Score { get; set; }

    public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBais { get; set; } = new List<ChiTietSoDauBai>();
}
