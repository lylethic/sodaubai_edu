namespace server.Dtos;

public class UserRoleDto
{
    public int Id { get; set; }
    public int RoleId { get; set; }
    public int UserId { get; set; }
}

public class CreateUserRoleDto
{
    public int RoleId { get; set; }
    public int UserId { get; set; }
}

public class UpdateUserRoleDto
{
    public int RoleId { get; set; }
    public int UserId { get; set; }
}
