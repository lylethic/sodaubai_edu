using Microsoft.AspNetCore.Mvc;

namespace server.Application.Dtos
{
  public class QueryObject
  {
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
  }

  public class PaginationRequest
  {
    private int _page = 1;
    private int _pageSize = 20;

    [FromQuery(Name = "page")]
    public int Page
    {
      get => _page;
      set => _page = value < 1 ? 1 : value;
    }

    [FromQuery(Name = "pageSize")]
    public int PageSize
    {
      get => _pageSize;
      set => _pageSize = value is >= 1 and < 100 ? value : 10;
    }
  }

  public class PaginatedRes<T>
  {
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
  }

}


