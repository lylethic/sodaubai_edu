namespace server.Dtos
{
  public class QueryObject
  {
    private int? _pageNumber;
    private int? _pageSize;
    public int PageNumber
    {
      get => _pageNumber ?? 1;
      set => _pageNumber = value;
    }
    public int PageSize
    {
      get => _pageSize > 100 ? 100 : (_pageSize ?? 20);
      set => _pageSize = value;
    }
  }
}
