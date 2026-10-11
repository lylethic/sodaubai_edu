using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;

namespace SoDauBai.Application.DTOs.Common;

public class QueryObject
{
    private int? _pageNumber;
    private int? _pageSize;

    [FromQuery(Name = "pageNumber")]
    [DefaultValue(1)]
    public int PageNumber
    {
        get => _pageNumber ?? 1;
        set => _pageNumber = value;
    }

    [FromQuery(Name = "pageSize")]
    [DefaultValue(20)]
    public int PageSize
    {
        get => _pageSize > 100 ? 100 : (_pageSize ?? 20);
        set => _pageSize = value;
    }

    [FromQuery(Name = "keyword")]
    public string? Keyword { get; set; } = null;

    [FromQuery(Name = "status")]
    public bool? Status { get; set; } = true;
}
