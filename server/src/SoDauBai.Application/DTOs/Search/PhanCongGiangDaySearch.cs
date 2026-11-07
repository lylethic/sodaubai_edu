using System;
using SoDauBai.Application.DTOs.Common;

namespace SoDauBai.Application.DTOs.Search;

public class PhanCongGiangDaySearch : QueryObject
{
  public int? BiaSoDauBaiId { get; set; } = null;
  public int? TeacherId { get; set; } = null;
}

