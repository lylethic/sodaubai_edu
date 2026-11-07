namespace SoDauBai.Application.DTOs;

public class RolePermissionDto
{
    public int Id { get; set; }
    public int RoleId { get; set; }
    public int PermissionId { get; set; }
}

public class CreateRolePermissionDto
{
    public int RoleId { get; set; }
    public int PermissionId { get; set; }
}

public class UpdateRolePermissionDto
{
    public int RoleId { get; set; }
    public int PermissionId { get; set; }
}

