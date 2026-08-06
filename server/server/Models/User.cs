namespace server.Models;

public partial class User : IBaseEntity
{
    public int Id { get; set; }
    public int? SchoolId { get; set; }
    public string Email { get; set; } = null!;
    public string? Username { get; set; }
    public string? Avatar { get; set; }
    public string PasswordHash { get; set; } = null!;
    public DateTime? DateCreated { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime? DateUpdated { get; set; }
    public int? UpdatedBy { get; set; }
    public bool Deleted { get; set; }

    public virtual School? School { get; set; }
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public virtual ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();
}
