namespace SoDauBai.Application.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public int? SchoolId { get; set; }
    public string Email { get; set; } = null!;
    public string? Username { get; set; }
    public string? Avatar { get; set; }
}

public class UserCreateBody
{
    public int SchoolId { get; set; }
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

public class ExtendUser
{
    public int Id { get; set; }

    public int? SchoolId { get; set; }

    public string Email { get; set; } = null!;

    public string? Username { get; set; }

    public string? Avatar { get; set; }
}

public class ExtendUserBody
{
    public int Id { get; set; }

    public int? SchoolId { get; set; }

    public string Email { get; set; } = null!;

    public string? Username { get; set; }

    public string? Avatar { get; set; }

    public ExtendSchool? ExtendSchool { get; set; } = null;
}

public class UserLoginInfoDto
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string? Username { get; set; }
    public string? Avatar { get; set; }
    public int? SchoolId { get; set; }
    public string? SchoolName { get; set; }
    public string? SchoolType { get; set; }
    public string? SchoolPhoneNumber { get; set; }
    public int? TeacherId { get; set; }
    public string? FullName { get; set; }
}

public class UserDetail
{
    public int? Id { get; set; }
    public string? Email { get; set; }
    public string? Username { get; set; }
    public string? Avatar { get; set; }
    public int? SchoolId { get; set; }
    public string? SchoolName { get; set; }
    public string? SchoolType { get; set; }
    public string? SchoolPhoneNumber { get; set; }
    public int? TeacherId { get; set; }
    public string? Fullname { get; set; }
    public int? RoleId { get; set; }
    public string? NameRole { get; set; }

    // StatusTeacher
    public bool? Status { get; set; }
    public bool? Gender { get; set; }
    public string? Address { get; set; }
    public string? PhotoPath { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public DateTime? DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
}