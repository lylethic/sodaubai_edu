namespace server.Dtos;

public class UserDto
{
    public int Id { get; set; }
    public int? SchoolId { get; set; }
    public string Email { get; set; } = null!;
    public string? Username { get; set; }
    public string? Avatar { get; set; }
}

public class CreateUserDto
{
    public int? SchoolId { get; set; }
    public string Email { get; set; } = null!;
    public string? Username { get; set; }
    public string? Avatar { get; set; }
    public string PasswordHash { get; set; } = null!;
}

public class UpdateUserDto
{
    public int? SchoolId { get; set; }
    public string? Email { get; set; }
    public string? Username { get; set; }
    public string? Avatar { get; set; }
    public string? PasswordHash { get; set; }
}
