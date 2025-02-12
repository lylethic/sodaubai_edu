namespace server.Types
{
  public class ModelResType
  {
    public bool IsSuccess { get; set; }

    public int StatusCode { get; set; }

    public string Message { get; set; } = String.Empty;
  }
}
