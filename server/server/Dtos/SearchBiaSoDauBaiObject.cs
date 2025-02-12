namespace server.Dtos
{
  public class SearchBiaSoDauBaiObject : QueryObject
  {
    public string? ClassName { get; set; } = string.Empty;
    public string? SchoolName { get; set; } = string.Empty;
    public int? SchoolId { get; set; }
    public int? ClassId { get; set; }
  }
}
