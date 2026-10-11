using System;

namespace SoDauBai.Application.DTOs;

public class MyInfoDto
{
  // User (u)
  public int Id { get; set; }
  public string Email { get; set; } = null!;
  public string? Username { get; set; }
  public string? Avatar { get; set; }
  public int? SchoolId { get; set; }

  // School (s)
  public string? SchoolName { get; set; }

  // Teacher (t)
  public int? TeacherId { get; set; }
  public string? Fullname { get; set; }
  public DateTime? DateOfBirth { get; set; }
  public bool? Gender { get; set; }
  public string? Address { get; set; }
  public string? PhotoPath { get; set; }
  public bool? Status { get; set; }
}
