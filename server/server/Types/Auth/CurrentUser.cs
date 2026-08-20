namespace server.Types.Auth
{
  public class CurrentUser
  {
    public int? Id { get; set; }
    public string? Email { get; set; }
    public int? SchoolId { get; set; }
    public int? RoleId { get; set; }
    public List<string> Roles { get; set; } = new();
    public bool IsAuthenticated { get; set; }
  }
}
