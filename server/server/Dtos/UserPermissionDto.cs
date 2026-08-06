namespace server.Dtos;

public class UserPermissionDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PermissionId { get; set; }
    public bool IsGranted { get; set; }
}

public class CreateUserPermissionDto
{
    public int UserId { get; set; }
    public int PermissionId { get; set; }
    public bool IsGranted { get; set; }
}

public class UpdateUserPermissionDto
{
    public int UserId { get; set; }
    public int PermissionId { get; set; }
    public bool IsGranted { get; set; }
}
