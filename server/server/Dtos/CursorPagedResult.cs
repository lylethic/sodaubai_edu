namespace server.Dtos;

public class CursorPagedResult<T>
{
  public List<T> Data { get; set; } = new List<T>();
  public int? NextCursor { get; set; }
  public bool HasNextPage { get; set; }
}

public class QueryRequest
{
  private int? _limit;
  public int Limit
  {
    get => _limit ?? 20;
    set => _limit = value;
  }
  public int? Cursor { get; set; }
  public string? SearchTerm { get; set; } = null;
}
