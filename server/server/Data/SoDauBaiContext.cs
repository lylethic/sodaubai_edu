using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Data;

public partial class SoDauBaiContext : DbContext
{
  public SoDauBaiContext()
  {
  }

  public SoDauBaiContext(DbContextOptions<SoDauBaiContext> options)
      : base(options)
  {
  }

  public virtual DbSet<AcademicYear> AcademicYears { get; set; }

  public virtual DbSet<BiaSoDauBai> BiaSoDauBais { get; set; }

  public virtual DbSet<ChiTietSoDauBai> ChiTietSoDauBais { get; set; }

  public virtual DbSet<Class> Classes { get; set; }

  public virtual DbSet<Classification> Classifications { get; set; }

  public virtual DbSet<Grade> Grades { get; set; }

  public virtual DbSet<MonthlyEvaluation> MonthlyEvaluations { get; set; }

  public virtual DbSet<Permission> Permissions { get; set; }

  public virtual DbSet<PhanCongChuNhiem> PhanCongChuNhiems { get; set; }

  public virtual DbSet<PhanCongGiangDay> PhanCongGiangDays { get; set; }

  public virtual DbSet<Role> Roles { get; set; }

  public virtual DbSet<RolePermission> RolePermissions { get; set; }

  public virtual DbSet<RollCall> RollCalls { get; set; }

  public virtual DbSet<RollCallDetail> RollCallDetails { get; set; }

  public virtual DbSet<School> Schools { get; set; }

  public virtual DbSet<Semester> Semesters { get; set; }

  public virtual DbSet<Session> Sessions { get; set; }

  public virtual DbSet<Student> Students { get; set; }

  public virtual DbSet<Subject> Subjects { get; set; }

  public virtual DbSet<SubjectAssignment> SubjectAssignments { get; set; }

  public virtual DbSet<Teacher> Teachers { get; set; }

  public virtual DbSet<User> Users { get; set; }

  public virtual DbSet<UserPermission> UserPermissions { get; set; }

  public virtual DbSet<UserRole> UserRoles { get; set; }

  public virtual DbSet<Week> Weeks { get; set; }

  public virtual DbSet<WeeklyEvaluation> WeeklyEvaluations { get; set; }

  protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
      => optionsBuilder.UseSqlServer("Server=.;Database=SoDauBai;Integrated Security=True;TrustServerCertificate=True");

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<AcademicYear>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Academic__F8DBC284F22A4AB7");

      entity.ToTable("AcademicYear");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(100);
      entity.Property(e => e.Name).HasMaxLength(100);
      entity.Property(e => e.Status).HasDefaultValue(true);
    });

    modelBuilder.Entity<BiaSoDauBai>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__BiaSoDau__B84AE35E6D878F11");

      entity.ToTable("BiaSoDauBai");

      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Status).HasDefaultValue(true);

      entity.HasOne(d => d.Academicyear).WithMany(p => p.BiaSoDauBais)
              .HasForeignKey(d => d.AcademicyearId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__BiaSoDauB__acade__72C60C4A");

      entity.HasOne(d => d.Class).WithMany(p => p.BiaSoDauBais)
              .HasForeignKey(d => d.ClassId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__BiaSoDauB__class__73BA3083");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.BiaSoDauBaiCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__BiaSoDauB__Creat__08162EEB");

      entity.HasOne(d => d.School).WithMany(p => p.BiaSoDauBais)
              .HasForeignKey(d => d.SchoolId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__BiaSoDauB__schoo__71D1E811");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.BiaSoDauBaiUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__BiaSoDauB__Updat__07220AB2");
    });

    modelBuilder.Entity<ChiTietSoDauBai>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__ChiTietS__684F0A5BC75F8D8F");

      entity.ToTable("ChiTietSoDauBai");

      entity.HasIndex(e => e.WeekId, "IDX_ChiTietSoDauBai_WeekId");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.DaysOfTheWeek).HasMaxLength(20);
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Note).HasMaxLength(255);
      entity.Property(e => e.Session).HasMaxLength(20);

      entity.HasOne(d => d.BiaSoDauBai).WithMany(p => p.ChiTietSoDauBais)
              .HasForeignKey(d => d.BiaSoDauBaiId)
              .HasConstraintName("FK__ChiTietSo__biaSo__2180FB33");

      entity.HasOne(d => d.Classification).WithMany(p => p.ChiTietSoDauBais)
              .HasForeignKey(d => d.ClassificationId)
              .HasConstraintName("FK__ChiTietSo__class__25518C17");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.ChiTietSoDauBaiCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__ChiTietSo__Creat__0AF29B96");

      entity.HasOne(d => d.Semester).WithMany(p => p.ChiTietSoDauBais)
              .HasForeignKey(d => d.SemesterId)
              .HasConstraintName("FK__ChiTietSo__semes__22751F6C");

      entity.HasOne(d => d.Subject).WithMany(p => p.ChiTietSoDauBais)
              .HasForeignKey(d => d.SubjectId)
              .HasConstraintName("FK__ChiTietSo__subje__245D67DE");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.ChiTietSoDauBaiUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__ChiTietSo__Updat__0BE6BFCF");

      entity.HasOne(d => d.Week).WithMany(p => p.ChiTietSoDauBais)
              .HasForeignKey(d => d.WeekId)
              .HasConstraintName("FK__ChiTietSo__weekI__236943A5");
    });

    modelBuilder.Entity<Class>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Class__7577347EF2845A37");

      entity.ToTable("Class");

      entity.Property(e => e.Description).HasMaxLength(100);
      entity.Property(e => e.Name).HasMaxLength(50);
      entity.Property(e => e.Status).HasDefaultValue(true);

      entity.HasOne(d => d.AcademicYear).WithMany(p => p.Classes)
              .HasForeignKey(d => d.AcademicYearId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__Class__academicY__5535A963");

      entity.HasOne(d => d.Grade).WithMany(p => p.Classes)
              .HasForeignKey(d => d.GradeId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__Class__gradeId__534D60F1");

      entity.HasOne(d => d.School).WithMany(p => p.Classes)
              .HasForeignKey(d => d.SchoolId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__Class__schoolId__5629CD9C");

      entity.HasOne(d => d.Teacher).WithMany(p => p.Classes)
              .HasForeignKey(d => d.TeacherId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__Class__teacherId__5441852A");
    });

    modelBuilder.Entity<Classification>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Classifi__93F59C962ED302E2");

      entity.ToTable("Classification");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Name).HasMaxLength(500);
      entity.Property(e => e.Score).HasColumnType("decimal(3, 1)");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.ClassificationCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Classific__Creat__04459E07");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.ClassificationUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Classific__Updat__0539C240");
    });

    modelBuilder.Entity<Grade>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Grade__FB4362F9F6031319");

      entity.ToTable("Grade");

      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(500);
      entity.Property(e => e.Name).HasMaxLength(50);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.GradeCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Grade__CreatedBy__473C8FC7");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.GradeUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Grade__UpdatedBy__4830B400");
    });

    modelBuilder.Entity<MonthlyEvaluation>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__MonthlyE__98A30995F93C518D");

      entity.ToTable("MonthlyEvaluation");

      entity.Property(e => e.AvgScore).HasColumnType("decimal(5, 2)");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(255);

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.MonthlyEvaluations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__MonthlyEv__Updat__0169315C");

      entity.HasOne(d => d.WeeklyEvaluation).WithMany(p => p.MonthlyEvaluations)
              .HasForeignKey(d => d.WeeklyEvaluationId)
              .OnDelete(DeleteBehavior.SetNull)
              .HasConstraintName("FK__MonthlyEv__weekl__308E3499");
    });

    modelBuilder.Entity<Permission>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Permissi__3214EC07D596F66A");

      entity.ToTable("Permission");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Name).HasMaxLength(255);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PermissionCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Permissio__Creat__6501FCD8");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PermissionUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Permissio__Updat__65F62111");
    });

    modelBuilder.Entity<PhanCongChuNhiem>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__PhanCong__B11B59634233BEEF");

      entity.ToTable("PhanCongChuNhiem");

      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(500);
      entity.Property(e => e.Status).HasDefaultValue(true);

      entity.HasOne(d => d.AcademicYear).WithMany(p => p.PhanCongChuNhiems)
              .HasForeignKey(d => d.AcademicYearId)
              .HasConstraintName("FK__PhanCongC__acade__1EA48E88");

      entity.HasOne(d => d.Class).WithMany(p => p.PhanCongChuNhiems)
              .HasForeignKey(d => d.ClassId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__PhanCongC__class__6D0D32F4");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PhanCongChuNhiemCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__PhanCongC__Creat__7E8CC4B1");

      entity.HasOne(d => d.Teacher).WithMany(p => p.PhanCongChuNhiems)
              .HasForeignKey(d => d.TeacherId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__PhanCongC__teach__6C190EBB");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PhanCongChuNhiemUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__PhanCongC__Updat__7F80E8EA");
    });

    modelBuilder.Entity<PhanCongGiangDay>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__PhanCong__6B45110FAC828123");

      entity.ToTable("PhanCongGiangDay");

      entity.Property(e => e.DateCreated).HasColumnType("datetime");
      entity.Property(e => e.DateUpdated).HasColumnType("datetime");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Status).HasDefaultValue(true);

      entity.HasOne(d => d.BiaSoDauBai).WithMany(p => p.PhanCongGiangDays)
              .HasForeignKey(d => d.BiaSoDauBaiId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__PhanCongG__biaSo__787EE5A0");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.PhanCongGiangDayCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__PhanCongG__Creat__7BB05806");

      entity.HasOne(d => d.Teacher).WithMany(p => p.PhanCongGiangDays)
              .HasForeignKey(d => d.TeacherId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__PhanCongG__teach__778AC167");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.PhanCongGiangDayUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__PhanCongG__Updat__7CA47C3F");
    });

    modelBuilder.Entity<Role>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Role__CD98462A2E70449A");

      entity.ToTable("Role");

      entity.Property(e => e.DateCreated).HasColumnType("datetime");
      entity.Property(e => e.DateUpdated).HasColumnType("datetime");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(50);
      entity.Property(e => e.NameRole)
              .HasMaxLength(20)
              .IsUnicode(false);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.RoleCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Role__CreatedBy__4865BE2A");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.RoleUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Role__UpdatedBy__4959E263");
    });

    modelBuilder.Entity<RolePermission>(entity =>
    {
      entity.HasKey(e => new { e.RoleId, e.PermissionId }).HasName("PK__RolePerm__6400A1A83F753C5C");

      entity.ToTable("RolePermission");

      entity.Property(e => e.DateCreated)
              .HasDefaultValueSql("(getdate())")
              .HasColumnType("datetime");
      entity.Property(e => e.Deleted).HasDefaultValue(false);

      entity.HasOne(d => d.Permission).WithMany(p => p.RolePermissions)
              .HasForeignKey(d => d.PermissionId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__RolePermi__Permi__6ABAD62E");

      entity.HasOne(d => d.Role).WithMany(p => p.RolePermissions)
              .HasForeignKey(d => d.RoleId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__RolePermi__RoleI__69C6B1F5");
    });

    modelBuilder.Entity<RollCall>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__RollCall__8A3C36491E2C5DA8");

      entity.ToTable("RollCall");

      entity.Property(e => e.DateAt).HasColumnType("datetime");
      entity.Property(e => e.DayOfTheWeek).HasMaxLength(20);
      entity.Property(e => e.Deleted).HasDefaultValue(false);

      entity.HasOne(d => d.Class).WithMany(p => p.RollCalls)
              .HasForeignKey(d => d.ClassId)
              .HasConstraintName("FK__RollCall__classI__10216507");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.RollCallCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__RollCall__Create__75035A77");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.RollCallUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__RollCall__Update__75F77EB0");

      entity.HasOne(d => d.Week).WithMany(p => p.RollCalls)
              .HasForeignKey(d => d.WeekId)
              .HasConstraintName("FK__RollCall__weekId__11158940");
    });

    modelBuilder.Entity<RollCallDetail>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__RollCall__067E7F37344571E0");

      entity.ToTable("RollCallDetail");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(500);
      entity.Property(e => e.IsExcused).HasDefaultValue(true);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.RollCallDetailCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__RollCallD__Creat__78D3EB5B");

      entity.HasOne(d => d.RollCall).WithMany(p => p.RollCallDetails)
              .HasForeignKey(d => d.RollCallId)
              .OnDelete(DeleteBehavior.Cascade)
              .HasConstraintName("FK__RollCallD__rollC__1B9317B3");

      entity.HasOne(d => d.Student).WithMany(p => p.RollCallDetails)
              .HasForeignKey(d => d.StudentId)
              .HasConstraintName("FK__RollCallD__stude__1C873BEC");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.RollCallDetailUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__RollCallD__Updat__79C80F94");
    });

    modelBuilder.Entity<School>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__School__129B97994F702CA8");

      entity.ToTable("School");

      entity.HasIndex(e => e.PhoneNumber, "UQ_School_PhoneNumber").IsUnique();

      entity.Property(e => e.DateCreated).HasColumnType("datetime");
      entity.Property(e => e.DateUpdated).HasColumnType("datetime");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(100);
      entity.Property(e => e.Name).HasMaxLength(200);
      entity.Property(e => e.PhoneNumber)
              .HasMaxLength(20)
              .IsUnicode(false);
      entity.Property(e => e.SchoolType).HasMaxLength(40);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.SchoolCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__School__CreatedB__0D0FEE32");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.SchoolUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__School__UpdatedB__0E04126B");
    });

    modelBuilder.Entity<Semester>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Semester__F2F37E870280302E");

      entity.ToTable("Semester");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(500);
      entity.Property(e => e.Name).HasMaxLength(100);
      entity.Property(e => e.Status).HasDefaultValue(true);

      entity.HasOne(d => d.AcademicYear).WithMany(p => p.Semesters)
              .HasForeignKey(d => d.AcademicYearId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__Semester__academ__4CA06362");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.SemesterCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Semester__Create__595B4002");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.SemesterUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Semester__Update__5A4F643B");
    });

    modelBuilder.Entity<Session>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Session__AC16DB476AE5069D");

      entity.ToTable("Session");

      entity.Property(e => e.Token).IsUnicode(false);
    });

    modelBuilder.Entity<Student>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Student__4D11D63CF8C06A45");

      entity.ToTable("Student");

      entity.Property(e => e.Address).HasMaxLength(500);
      entity.Property(e => e.DateCreated).HasColumnType("datetime");
      entity.Property(e => e.DateUpdated).HasColumnType("datetime");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(500);
      entity.Property(e => e.Fullname).HasMaxLength(100);
      entity.Property(e => e.Status).HasDefaultValue(true);

      entity.HasOne(d => d.Class).WithMany(p => p.Students)
              .HasForeignKey(d => d.ClassId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_Student_Class");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.StudentCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Student__Created__63D8CE75");

      entity.HasOne(d => d.Grade).WithMany(p => p.Students)
              .HasForeignKey(d => d.GradeId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK_Student_Grade");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.StudentUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Student__Updated__64CCF2AE");

      entity.HasOne(d => d.User).WithMany(p => p.StudentUsers)
              .HasForeignKey(d => d.UserId)
              .HasConstraintName("FK_Student_User");
    });

    modelBuilder.Entity<Subject>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Subject__ACF9A76049DF2750");

      entity.ToTable("Subject");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Name).HasMaxLength(100);
      entity.Property(e => e.Status).HasDefaultValue(true);
      entity.Property(e => e.Description).HasMaxLength(500);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.SubjectCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Subject__Created__7226EDCC");

      entity.HasOne(d => d.Grade).WithMany(p => p.Subjects)
              .HasForeignKey(d => d.GradeId)
              .HasConstraintName("FK_Subject_Grade");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.SubjectUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Subject__Updated__731B1205");
    });

    modelBuilder.Entity<SubjectAssignment>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__SubjectA__803AC446C4C89C7C");

      entity.ToTable("SubjectAssignment");

      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(500);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.SubjectAssignmentCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__SubjectAs__Creat__6E565CE8");

      entity.HasOne(d => d.Subject).WithMany(p => p.SubjectAssignments)
              .HasForeignKey(d => d.SubjectId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__SubjectAs__subje__628FA481");

      entity.HasOne(d => d.Teacher).WithMany(p => p.SubjectAssignments)
              .HasForeignKey(d => d.TeacherId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__SubjectAs__teach__619B8048");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.SubjectAssignmentUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__SubjectAs__Updat__6F4A8121");
    });

    modelBuilder.Entity<Teacher>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Teacher__98E93895630519B1");

      entity.ToTable("Teacher");

      entity.HasIndex(e => e.Fullname, "IX_Teacher_Fullname");

      entity.Property(e => e.Address).HasMaxLength(200);
      entity.Property(e => e.DateCreated).HasColumnType("datetime2");
      entity.Property(e => e.DateOfBirth).HasColumnType("datetime2");
      entity.Property(e => e.DateUpdated).HasColumnType("datetime2");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Fullname)
              .HasMaxLength(100)
              .UseCollation("Vietnamese_CI_AI");
      entity.Property(e => e.Gender).HasDefaultValue(true);
      entity.Property(e => e.PhotoPath)
              .HasMaxLength(500)
              .IsUnicode(false);
      entity.Property(e => e.Status).HasDefaultValue(true);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.TeacherCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__Teacher__Created__66B53B20");

      entity.HasOne(d => d.School).WithMany(p => p.Teachers)
              .HasForeignKey(d => d.SchoolId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__Teacher__schoolI__47DBAE45");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.TeacherUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__Teacher__Updated__67A95F59");

      entity.HasOne(d => d.User).WithMany(p => p.TeacherUsers)
              .HasForeignKey(d => d.UserId)
              .HasConstraintName("FK_Teacher_User");
    });

    modelBuilder.Entity<User>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__User__3214EC07ADCBE5AF");

      entity.ToTable("User");

      entity.HasIndex(e => e.Email, "IX_User_Email");

      entity.HasIndex(e => e.Email, "UQ__User__A9D10534C9C48598").IsUnique();

      entity.Property(e => e.Avatar)
              .HasMaxLength(500)
              .IsUnicode(false);
      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Email)
              .HasMaxLength(50)
              .IsUnicode(false);
      entity.Property(e => e.PasswordHash)
              .HasMaxLength(200)
              .IsUnicode(false);
      entity.Property(e => e.Username)
              .HasMaxLength(100)
              .IsUnicode(false);

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.InverseCreatedByNavigation)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__User__CreatedBy__44952D46");

      entity.HasOne(d => d.School).WithMany(p => p.Users)
              .HasForeignKey(d => d.SchoolId)
              .HasConstraintName("FK__User__SchoolId__42ACE4D4");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.InverseUpdatedByNavigation)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__User__UpdatedBy__4589517F");
    });

    modelBuilder.Entity<UserPermission>(entity =>
    {
      entity.HasKey(e => new { e.UserId, e.PermissionId }).HasName("PK__UserPerm__F972A3FE90519A8E");

      entity.ToTable("UserPermission");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.IsGranted).HasDefaultValue(true);

      entity.HasOne(d => d.Permission).WithMany(p => p.UserPermissions)
              .HasForeignKey(d => d.PermissionId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__UserPermi__Permi__7908F585");

      entity.HasOne(d => d.User).WithMany(p => p.UserPermissions)
              .HasForeignKey(d => d.UserId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__UserPermi__UserI__7814D14C");
    });

    modelBuilder.Entity<UserRole>(entity =>
    {
      entity.HasKey(e => new { e.RoleId, e.UserId }).HasName("PK__UserRole__5B8242DEF4F332C5");

      entity.ToTable("UserRole");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);

      entity.HasOne(d => d.Role).WithMany(p => p.UserRoles)
              .HasForeignKey(d => d.RoleId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__UserRole__RoleId__6F7F8B4B");

      entity.HasOne(d => d.User).WithMany(p => p.UserRoles)
              .HasForeignKey(d => d.UserId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__UserRole__UserId__7073AF84");
    });

    modelBuilder.Entity<Week>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__Week__982269FECEF27BBB");

      entity.ToTable("Week");

      entity.Property(e => e.DateCreated).HasDefaultValueSql("(getutcdate())");
      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Name)
              .HasMaxLength(50)
              .UseCollation("Vietnamese_CI_AI");
      entity.Property(e => e.Status).HasDefaultValue(true);
      entity.Property(e => e.WeekEnd).HasColumnType("datetime");
      entity.Property(e => e.WeekStart).HasColumnType("datetime");

      entity.HasOne(d => d.Semester).WithMany(p => p.Weeks)
              .HasForeignKey(d => d.SemesterId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .HasConstraintName("FK__Week__semesterId__68487DD7");
    });

    modelBuilder.Entity<WeeklyEvaluation>(entity =>
    {
      entity.HasKey(e => e.Id).HasName("PK__WeeklyEv__436009AFD9A91260");

      entity.ToTable("WeeklyEvaluation");

      entity.Property(e => e.Deleted).HasDefaultValue(false);
      entity.Property(e => e.Description).HasMaxLength(500);
      entity.Property(e => e.Name).HasMaxLength(50);

      entity.HasOne(d => d.Class).WithMany(p => p.WeeklyEvaluations)
              .HasForeignKey(d => d.ClassId)
              .OnDelete(DeleteBehavior.SetNull)
              .HasConstraintName("FK__WeeklyEva__class__2BC97F7C");

      entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.WeeklyEvaluationCreatedByNavigations)
              .HasForeignKey(d => d.CreatedBy)
              .HasConstraintName("FK__WeeklyEva__Creat__6B79F03D");

      entity.HasOne(d => d.Teacher).WithMany(p => p.WeeklyEvaluations)
              .HasForeignKey(d => d.TeacherId)
              .OnDelete(DeleteBehavior.SetNull)
              .HasConstraintName("FK__WeeklyEva__teach__2CBDA3B5");

      entity.HasOne(d => d.UpdatedByNavigation).WithMany(p => p.WeeklyEvaluationUpdatedByNavigations)
              .HasForeignKey(d => d.UpdatedBy)
              .HasConstraintName("FK__WeeklyEva__Updat__6C6E1476");

      entity.HasOne(d => d.Week).WithMany(p => p.WeeklyEvaluations)
              .HasForeignKey(d => d.WeekId)
              .OnDelete(DeleteBehavior.SetNull)
              .HasConstraintName("FK__WeeklyEva__weekI__2DB1C7EE");
    });

    OnModelCreatingPartial(modelBuilder);
  }

  partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
