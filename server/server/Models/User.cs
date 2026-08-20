using System;
using System.Collections.Generic;

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

  public bool? Deleted { get; set; } = false;

  public virtual ICollection<BiaSoDauBai> BiaSoDauBaiCreatedByNavigations { get; set; } = new List<BiaSoDauBai>();

  public virtual ICollection<BiaSoDauBai> BiaSoDauBaiUpdatedByNavigations { get; set; } = new List<BiaSoDauBai>();

  public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBaiCreatedByNavigations { get; set; } = new List<ChiTietSoDauBai>();

  public virtual ICollection<ChiTietSoDauBai> ChiTietSoDauBaiUpdatedByNavigations { get; set; } = new List<ChiTietSoDauBai>();

  public virtual ICollection<Classification> ClassificationCreatedByNavigations { get; set; } = new List<Classification>();

  public virtual ICollection<Classification> ClassificationUpdatedByNavigations { get; set; } = new List<Classification>();

  public virtual User? CreatedByNavigation { get; set; }

  public virtual ICollection<Grade> GradeCreatedByNavigations { get; set; } = new List<Grade>();

  public virtual ICollection<Grade> GradeUpdatedByNavigations { get; set; } = new List<Grade>();

  public virtual ICollection<User> InverseCreatedByNavigation { get; set; } = new List<User>();

  public virtual ICollection<User> InverseUpdatedByNavigation { get; set; } = new List<User>();

  public virtual ICollection<MonthlyEvaluation> MonthlyEvaluations { get; set; } = new List<MonthlyEvaluation>();

  public virtual ICollection<Permission> PermissionCreatedByNavigations { get; set; } = new List<Permission>();

  public virtual ICollection<Permission> PermissionUpdatedByNavigations { get; set; } = new List<Permission>();

  public virtual ICollection<PhanCongChuNhiem> PhanCongChuNhiemCreatedByNavigations { get; set; } = new List<PhanCongChuNhiem>();

  public virtual ICollection<PhanCongChuNhiem> PhanCongChuNhiemUpdatedByNavigations { get; set; } = new List<PhanCongChuNhiem>();

  public virtual ICollection<PhanCongGiangDay> PhanCongGiangDayCreatedByNavigations { get; set; } = new List<PhanCongGiangDay>();

  public virtual ICollection<PhanCongGiangDay> PhanCongGiangDayUpdatedByNavigations { get; set; } = new List<PhanCongGiangDay>();

  public virtual ICollection<Role> RoleCreatedByNavigations { get; set; } = new List<Role>();

  public virtual ICollection<Role> RoleUpdatedByNavigations { get; set; } = new List<Role>();

  public virtual ICollection<RollCall> RollCallCreatedByNavigations { get; set; } = new List<RollCall>();

  public virtual ICollection<RollCallDetail> RollCallDetailCreatedByNavigations { get; set; } = new List<RollCallDetail>();

  public virtual ICollection<RollCallDetail> RollCallDetailUpdatedByNavigations { get; set; } = new List<RollCallDetail>();

  public virtual ICollection<RollCall> RollCallUpdatedByNavigations { get; set; } = new List<RollCall>();

  public virtual School? School { get; set; }

  public virtual ICollection<School> SchoolCreatedByNavigations { get; set; } = new List<School>();

  public virtual ICollection<School> SchoolUpdatedByNavigations { get; set; } = new List<School>();

  public virtual ICollection<Semester> SemesterCreatedByNavigations { get; set; } = new List<Semester>();

  public virtual ICollection<Semester> SemesterUpdatedByNavigations { get; set; } = new List<Semester>();

  public virtual ICollection<Student> StudentCreatedByNavigations { get; set; } = new List<Student>();

  public virtual ICollection<Student> StudentUpdatedByNavigations { get; set; } = new List<Student>();

  public virtual ICollection<Student> StudentUsers { get; set; } = new List<Student>();
  public virtual ICollection<Teacher> TeacherUsers { get; set; } = new List<Teacher>();

  public virtual ICollection<SubjectAssignment> SubjectAssignmentCreatedByNavigations { get; set; } = new List<SubjectAssignment>();

  public virtual ICollection<SubjectAssignment> SubjectAssignmentUpdatedByNavigations { get; set; } = new List<SubjectAssignment>();

  public virtual ICollection<Subject> SubjectCreatedByNavigations { get; set; } = new List<Subject>();

  public virtual ICollection<Subject> SubjectUpdatedByNavigations { get; set; } = new List<Subject>();

  public virtual ICollection<Teacher> TeacherCreatedByNavigations { get; set; } = new List<Teacher>();

  public virtual ICollection<Teacher> TeacherUpdatedByNavigations { get; set; } = new List<Teacher>();

  public virtual User? UpdatedByNavigation { get; set; }

  public virtual ICollection<UserPermission> UserPermissions { get; set; } = new List<UserPermission>();

  public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

  public virtual ICollection<WeeklyEvaluation> WeeklyEvaluationCreatedByNavigations { get; set; } = new List<WeeklyEvaluation>();

  public virtual ICollection<WeeklyEvaluation> WeeklyEvaluationUpdatedByNavigations { get; set; } = new List<WeeklyEvaluation>();
}
