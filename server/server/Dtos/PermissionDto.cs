using server.Models;

namespace server.Dtos;

public class PermissionDto
{
  public int Id { get; set; }
  public string Name { get; set; } = null!;
  public string? Description { get; set; }
}

public class CreatePermissionDto
{
  public string Name { get; set; } = null!;
  public string? Description { get; set; }
}

public class UpdatePermissionDto
{
  public string? Name { get; set; }
  public string? Description { get; set; }
}

public class UserRolesAndPermissions
{
  public List<Role> Roles { get; set; } = new();
  public List<Permission> Permissions { get; set; } = new();
}
