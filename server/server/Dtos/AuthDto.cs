using server.Models;

namespace server.Dtos
{
  public class AuthDto
  {
    public string? Email { get; set; }
    public string? Password { get; set; }
  }
}
