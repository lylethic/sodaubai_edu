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

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<BiaSoDauBai> BiaSoDauBais { get; set; }

    public virtual DbSet<ChiTietSoDauBai> ChiTietSoDauBais { get; set; }

    public virtual DbSet<Class> Classes { get; set; }

    public virtual DbSet<Classification> Classifications { get; set; }

    public virtual DbSet<Grade> Grades { get; set; }

    public virtual DbSet<MonthlyEvaluation> MonthlyEvaluations { get; set; }

    public virtual DbSet<PhanCongChuNhiem> PhanCongChuNhiems { get; set; }

    public virtual DbSet<PhanCongGiangDay> PhanCongGiangDays { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<RollCall> RollCalls { get; set; }

    public virtual DbSet<RollCallDetail> RollCallDetails { get; set; }

    public virtual DbSet<School> Schools { get; set; }

    public virtual DbSet<Semester> Semesters { get; set; }

    public virtual DbSet<Session> Sessions { get; set; }

    public virtual DbSet<Student> Students { get; set; }

    public virtual DbSet<Subject> Subjects { get; set; }

    public virtual DbSet<SubjectAssignment> SubjectAssignments { get; set; }

    public virtual DbSet<Teacher> Teachers { get; set; }

    public virtual DbSet<Week> Weeks { get; set; }

    public virtual DbSet<WeeklyEvaluation> WeeklyEvaluations { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=ConnectionStrings:SoDauBaiContext");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AcademicYear>(entity =>
        {
            entity.HasKey(e => e.AcademicYearId).HasName("PK__Academic__F8DBC284F22A4AB7");

            entity.ToTable("AcademicYear");

            entity.Property(e => e.AcademicYearId).HasColumnName("academicYearId");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.DisplayAcademicYearName)
                .HasMaxLength(100)
                .HasColumnName("displayAcademicYear_Name");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.YearEnd)
                .HasColumnType("datetime")
                .HasColumnName("yearEnd");
            entity.Property(e => e.YearStart)
                .HasColumnType("datetime")
                .HasColumnName("yearStart");
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Account__F267251EC17D30B7");

            entity.ToTable("Account");

            entity.HasIndex(e => e.Email, "UQ__Account__AB6E61646734D732").IsUnique();

            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .HasColumnName("email");
            entity.Property(e => e.MatKhau)
                .HasMaxLength(200)
                .HasColumnName("matKhau");
            entity.Property(e => e.PasswordSalt)
                .HasMaxLength(200)
                .HasColumnName("passwordSalt");
            entity.Property(e => e.RoleId).HasColumnName("roleId");
            entity.Property(e => e.SchoolId).HasColumnName("schoolId");

            entity.HasOne(d => d.Role).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Account__roleId__3E52440B");

            entity.HasOne(d => d.School).WithMany(p => p.Accounts)
                .HasForeignKey(d => d.SchoolId)
                .HasConstraintName("FK__Account__schoolI__3F466844");
        });

        modelBuilder.Entity<BiaSoDauBai>(entity =>
        {
            entity.HasKey(e => e.BiaSoDauBaiId).HasName("PK__BiaSoDau__B84AE35E6D878F11");

            entity.ToTable("BiaSoDauBai");

            entity.Property(e => e.BiaSoDauBaiId).HasColumnName("biaSoDauBaiId");
            entity.Property(e => e.AcademicyearId).HasColumnName("academicyearId");
            entity.Property(e => e.ClassId).HasColumnName("classId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.SchoolId).HasColumnName("schoolId");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");

            entity.HasOne(d => d.Academicyear).WithMany(p => p.BiaSoDauBais)
                .HasForeignKey(d => d.AcademicyearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BiaSoDauB__acade__72C60C4A");

            entity.HasOne(d => d.Class).WithMany(p => p.BiaSoDauBais)
                .HasForeignKey(d => d.ClassId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BiaSoDauB__class__73BA3083");

            entity.HasOne(d => d.School).WithMany(p => p.BiaSoDauBais)
                .HasForeignKey(d => d.SchoolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BiaSoDauB__schoo__71D1E811");
        });

        modelBuilder.Entity<ChiTietSoDauBai>(entity =>
        {
            entity.HasKey(e => e.ChiTietSoDauBaiId).HasName("PK__ChiTietS__684F0A5BC75F8D8F");

            entity.ToTable("ChiTietSoDauBai");

            entity.HasIndex(e => e.WeekId, "IDX_ChiTietSoDauBai_WeekId");

            entity.Property(e => e.ChiTietSoDauBaiId).HasColumnName("chiTietSoDauBaiId");
            entity.Property(e => e.Attend).HasColumnName("attend");
            entity.Property(e => e.BiaSoDauBaiId).HasColumnName("biaSoDauBaiId");
            entity.Property(e => e.BuoiHoc)
                .HasMaxLength(10)
                .HasColumnName("buoiHoc");
            entity.Property(e => e.ClassificationId).HasColumnName("classificationId");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.DaysOfTheWeek).HasMaxLength(10);
            entity.Property(e => e.LessonContent).HasColumnName("lessonContent");
            entity.Property(e => e.NoteComment)
                .HasMaxLength(255)
                .HasColumnName("noteComment");
            entity.Property(e => e.SemesterId).HasColumnName("semesterId");
            entity.Property(e => e.SubjectId).HasColumnName("subjectId");
            entity.Property(e => e.ThoiGian)
                .HasColumnType("datetime")
                .HasColumnName("thoiGian");
            entity.Property(e => e.TietHoc).HasColumnName("tietHoc");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(NULL)")
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");
            entity.Property(e => e.WeekId).HasColumnName("weekId");

            entity.HasOne(d => d.BiaSoDauBai).WithMany(p => p.ChiTietSoDauBais)
                .HasForeignKey(d => d.BiaSoDauBaiId)
                .HasConstraintName("FK__ChiTietSo__biaSo__2180FB33");

            entity.HasOne(d => d.Classification).WithMany(p => p.ChiTietSoDauBais)
                .HasForeignKey(d => d.ClassificationId)
                .HasConstraintName("FK__ChiTietSo__class__25518C17");

            entity.HasOne(d => d.Semester).WithMany(p => p.ChiTietSoDauBais)
                .HasForeignKey(d => d.SemesterId)
                .HasConstraintName("FK__ChiTietSo__semes__22751F6C");

            entity.HasOne(d => d.Subject).WithMany(p => p.ChiTietSoDauBais)
                .HasForeignKey(d => d.SubjectId)
                .HasConstraintName("FK__ChiTietSo__subje__245D67DE");

            entity.HasOne(d => d.Week).WithMany(p => p.ChiTietSoDauBais)
                .HasForeignKey(d => d.WeekId)
                .HasConstraintName("FK__ChiTietSo__weekI__236943A5");
        });

        modelBuilder.Entity<Class>(entity =>
        {
            entity.HasKey(e => e.ClassId).HasName("PK__Class__7577347EF2845A37");

            entity.ToTable("Class");

            entity.Property(e => e.ClassId).HasColumnName("classId");
            entity.Property(e => e.AcademicYearId).HasColumnName("academicYearId");
            entity.Property(e => e.ClassName)
                .HasMaxLength(50)
                .HasColumnName("className");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.GradeId).HasColumnName("gradeId");
            entity.Property(e => e.NumberOfAttendants).HasColumnName("numberOfAttendants");
            entity.Property(e => e.SchoolId).HasColumnName("schoolId");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.TeacherId).HasColumnName("teacherId");

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
            entity.HasKey(e => e.ClassificationId).HasName("PK__Classifi__93F59C962ED302E2");

            entity.ToTable("Classification");

            entity.Property(e => e.ClassificationId).HasColumnName("classificationId");
            entity.Property(e => e.ClassifyName)
                .HasMaxLength(100)
                .HasColumnName("classifyName");
            entity.Property(e => e.Score).HasColumnName("score");
        });

        modelBuilder.Entity<Grade>(entity =>
        {
            entity.HasKey(e => e.GradeId).HasName("PK__Grade__FB4362F9F6031319");

            entity.ToTable("Grade");

            entity.Property(e => e.GradeId).HasColumnName("gradeId");
            entity.Property(e => e.AcademicYearId).HasColumnName("academicYearId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.GradeName)
                .HasMaxLength(50)
                .HasColumnName("gradeName");

            entity.HasOne(d => d.AcademicYear).WithMany(p => p.Grades)
                .HasForeignKey(d => d.AcademicYearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Grade__academicY__4F7CD00D");
        });

        modelBuilder.Entity<MonthlyEvaluation>(entity =>
        {
            entity.HasKey(e => e.MonthlyEvaluationId).HasName("PK__MonthlyE__98A30995F93C518D");

            entity.ToTable("MonthlyEvaluation");

            entity.Property(e => e.MonthlyEvaluationId).HasColumnName("monthlyEvaluationId");
            entity.Property(e => e.AvgScore)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("avgScore");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.CreatedBy).HasColumnName("createdBy");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.MonthEvaluation).HasColumnName("monthEvaluation");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");
            entity.Property(e => e.WeeklyEvaluationId).HasColumnName("weeklyEvaluationId");

            entity.HasOne(d => d.WeeklyEvaluation).WithMany(p => p.MonthlyEvaluations)
                .HasForeignKey(d => d.WeeklyEvaluationId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__MonthlyEv__weekl__308E3499");
        });

        modelBuilder.Entity<PhanCongChuNhiem>(entity =>
        {
            entity.HasKey(e => e.PhanCongChuNhiemId).HasName("PK__PhanCong__B11B59634233BEEF");

            entity.ToTable("PhanCongChuNhiem");

            entity.Property(e => e.PhanCongChuNhiemId).HasColumnName("phanCongChuNhiemId");
            entity.Property(e => e.AcademicYearId).HasColumnName("academicYearId");
            entity.Property(e => e.ClassId).HasColumnName("classId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.TeacherId).HasColumnName("teacherId");

            entity.HasOne(d => d.AcademicYear).WithMany(p => p.PhanCongChuNhiems)
                .HasForeignKey(d => d.AcademicYearId)
                .HasConstraintName("FK__PhanCongC__acade__1EA48E88");

            entity.HasOne(d => d.Class).WithMany(p => p.PhanCongChuNhiems)
                .HasForeignKey(d => d.ClassId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhanCongC__class__6D0D32F4");

            entity.HasOne(d => d.Teacher).WithMany(p => p.PhanCongChuNhiems)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhanCongC__teach__6C190EBB");
        });

        modelBuilder.Entity<PhanCongGiangDay>(entity =>
        {
            entity.HasKey(e => e.PhanCongGiangDayId).HasName("PK__PhanCong__6B45110FAC828123");

            entity.ToTable("PhanCongGiangDay");

            entity.Property(e => e.PhanCongGiangDayId).HasColumnName("phanCongGiangDayId");
            entity.Property(e => e.BiaSoDauBaiId).HasColumnName("biaSoDauBaiId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.TeacherId).HasColumnName("teacherId");

            entity.HasOne(d => d.BiaSoDauBai).WithMany(p => p.PhanCongGiangDays)
                .HasForeignKey(d => d.BiaSoDauBaiId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhanCongG__biaSo__787EE5A0");

            entity.HasOne(d => d.Teacher).WithMany(p => p.PhanCongGiangDays)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PhanCongG__teach__778AC167");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__CD98462A2E70449A");

            entity.ToTable("Role");

            entity.Property(e => e.RoleId).HasColumnName("roleId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Description)
                .HasMaxLength(50)
                .HasColumnName("description");
            entity.Property(e => e.NameRole)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("nameRole");
        });

        modelBuilder.Entity<RollCall>(entity =>
        {
            entity.HasKey(e => e.RollCallId).HasName("PK__RollCall__8A3C36491E2C5DA8");

            entity.ToTable("RollCall");

            entity.Property(e => e.RollCallId).HasColumnName("rollCallId");
            entity.Property(e => e.ClassId).HasColumnName("classId");
            entity.Property(e => e.DateAt)
                .HasColumnType("datetime")
                .HasColumnName("date_At");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.DayOfTheWeek)
                .HasMaxLength(20)
                .HasColumnName("dayOfTheWeek");
            entity.Property(e => e.NumberOfAttendants).HasColumnName("numberOfAttendants");
            entity.Property(e => e.WeekId).HasColumnName("weekId");

            entity.HasOne(d => d.Class).WithMany(p => p.RollCalls)
                .HasForeignKey(d => d.ClassId)
                .HasConstraintName("FK__RollCall__classI__10216507");

            entity.HasOne(d => d.Week).WithMany(p => p.RollCalls)
                .HasForeignKey(d => d.WeekId)
                .HasConstraintName("FK__RollCall__weekId__11158940");
        });

        modelBuilder.Entity<RollCallDetail>(entity =>
        {
            entity.HasKey(e => e.AbsenceId).HasName("PK__RollCall__067E7F37344571E0");

            entity.ToTable("RollCallDetail");

            entity.Property(e => e.AbsenceId).HasColumnName("absenceId");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IsExcused)
                .HasDefaultValue(true)
                .HasColumnName("isExcused");
            entity.Property(e => e.RollCallId).HasColumnName("rollCallId");
            entity.Property(e => e.StudentId).HasColumnName("studentId");

            entity.HasOne(d => d.RollCall).WithMany(p => p.RollCallDetails)
                .HasForeignKey(d => d.RollCallId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__RollCallD__rollC__1B9317B3");

            entity.HasOne(d => d.Student).WithMany(p => p.RollCallDetails)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK__RollCallD__stude__1C873BEC");
        });

        modelBuilder.Entity<School>(entity =>
        {
            entity.HasKey(e => e.SchoolId).HasName("PK__School__129B97994F702CA8");

            entity.ToTable("School");

            entity.HasIndex(e => e.PhoneNumber, "UQ__School__4849DA01E5AFEBAE").IsUnique();

            entity.Property(e => e.SchoolId).HasColumnName("schoolId");
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .HasColumnName("address");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.DistrictId).HasColumnName("districtId");
            entity.Property(e => e.NameSchool)
                .HasMaxLength(200)
                .HasColumnName("nameSchool");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(10)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("phoneNumber");
            entity.Property(e => e.ProvinceId).HasColumnName("provinceId");
            entity.Property(e => e.SchoolType)
                .HasMaxLength(40)
                .HasColumnName("schoolType");
        });

        modelBuilder.Entity<Semester>(entity =>
        {
            entity.HasKey(e => e.SemesterId).HasName("PK__Semester__F2F37E870280302E");

            entity.ToTable("Semester");

            entity.Property(e => e.SemesterId).HasColumnName("semesterId");
            entity.Property(e => e.AcademicYearId).HasColumnName("academicYearId");
            entity.Property(e => e.DateEnd)
                .HasColumnType("datetime")
                .HasColumnName("dateEnd");
            entity.Property(e => e.DateStart)
                .HasColumnType("datetime")
                .HasColumnName("dateStart");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.SemesterName)
                .HasMaxLength(100)
                .HasColumnName("semesterName");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");

            entity.HasOne(d => d.AcademicYear).WithMany(p => p.Semesters)
                .HasForeignKey(d => d.AcademicYearId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Semester__academ__4CA06362");
        });

        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(e => e.TokenId).HasName("PK__Session__AC16DB476AE5069D");

            entity.ToTable("Session");

            entity.Property(e => e.TokenId).HasColumnName("tokenId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.ExpiresAt)
                .HasColumnType("datetime")
                .HasColumnName("expiresAt");
            entity.Property(e => e.Token)
                .IsUnicode(false)
                .HasColumnName("token");

            entity.HasOne(d => d.Account).WithMany(p => p.Sessions)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Session__account__4222D4EF");
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasKey(e => e.StudentId).HasName("PK__Student__4D11D63CF8C06A45");

            entity.ToTable("Student");

            entity.Property(e => e.StudentId).HasColumnName("studentId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .HasColumnName("address");
            entity.Property(e => e.ClassId).HasColumnName("classId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateOfBirth)
                .HasColumnType("datetime")
                .HasColumnName("dateOfBirth");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.Fullname)
                .HasMaxLength(100)
                .HasColumnName("fullname");
            entity.Property(e => e.GradeId).HasColumnName("gradeId");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");

            entity.HasOne(d => d.Account).WithMany(p => p.Students)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Student__account__5BE2A6F2");

            entity.HasOne(d => d.Class).WithMany(p => p.Students)
                .HasForeignKey(d => d.ClassId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Student__classId__5AEE82B9");

            entity.HasOne(d => d.Grade).WithMany(p => p.Students)
                .HasForeignKey(d => d.GradeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Student__descrip__59FA5E80");
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.SubjectId).HasName("PK__Subject__ACF9A76049DF2750");

            entity.ToTable("Subject");

            entity.Property(e => e.SubjectId).HasColumnName("subjectId");
            entity.Property(e => e.GradeId).HasColumnName("gradeId");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.SubjectName)
                .HasMaxLength(100)
                .HasColumnName("subjectName");

            entity.HasOne(d => d.Grade).WithMany(p => p.Subjects)
                .HasForeignKey(d => d.GradeId)
                .HasConstraintName("FK_Subject_Grade");
        });

        modelBuilder.Entity<SubjectAssignment>(entity =>
        {
            entity.HasKey(e => e.SubjectAssignmentId).HasName("PK__SubjectA__803AC446C4C89C7C");

            entity.ToTable("SubjectAssignment");

            entity.Property(e => e.SubjectAssignmentId).HasColumnName("subjectAssignmentId");
            entity.Property(e => e.DateCreated)
                .HasColumnType("datetime")
                .HasColumnName("dateCreated");
            entity.Property(e => e.DateUpdated)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdated");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.SubjectId).HasColumnName("subjectId");
            entity.Property(e => e.TeacherId).HasColumnName("teacherId");

            entity.HasOne(d => d.Subject).WithMany(p => p.SubjectAssignments)
                .HasForeignKey(d => d.SubjectId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SubjectAs__subje__628FA481");

            entity.HasOne(d => d.Teacher).WithMany(p => p.SubjectAssignments)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SubjectAs__teach__619B8048");
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.TeacherId).HasName("PK__Teacher__98E93895630519B1");

            entity.ToTable("Teacher");

            entity.HasIndex(e => e.Fullname, "IX_Teacher_Fullname");

            entity.Property(e => e.TeacherId).HasColumnName("teacherId");
            entity.Property(e => e.AccountId).HasColumnName("accountId");
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .HasColumnName("address");
            entity.Property(e => e.DateCreate)
                .HasColumnType("datetime")
                .HasColumnName("dateCreate");
            entity.Property(e => e.DateOfBirth)
                .HasColumnType("datetime")
                .HasColumnName("dateOfBirth");
            entity.Property(e => e.DateUpdate)
                .HasColumnType("datetime")
                .HasColumnName("dateUpdate");
            entity.Property(e => e.Fullname)
                .HasMaxLength(100)
                .UseCollation("Vietnamese_CI_AI")
                .HasColumnName("fullname");
            entity.Property(e => e.Gender)
                .HasDefaultValue(true)
                .HasColumnName("gender");
            entity.Property(e => e.PhotoPath)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("photoPath");
            entity.Property(e => e.SchoolId).HasColumnName("schoolId");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");

            entity.HasOne(d => d.Account).WithMany(p => p.Teachers)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Teacher__account__46E78A0C");

            entity.HasOne(d => d.School).WithMany(p => p.Teachers)
                .HasForeignKey(d => d.SchoolId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Teacher__schoolI__47DBAE45");
        });

        modelBuilder.Entity<Week>(entity =>
        {
            entity.HasKey(e => e.WeekId).HasName("PK__Week__982269FECEF27BBB");

            entity.ToTable("Week");

            entity.Property(e => e.WeekId).HasColumnName("weekId");
            entity.Property(e => e.SemesterId).HasColumnName("semesterId");
            entity.Property(e => e.Status)
                .HasDefaultValue(true)
                .HasColumnName("status");
            entity.Property(e => e.WeekEnd)
                .HasColumnType("datetime")
                .HasColumnName("weekEnd");
            entity.Property(e => e.WeekName)
                .HasMaxLength(50)
                .UseCollation("Vietnamese_CI_AI")
                .HasColumnName("weekName");
            entity.Property(e => e.WeekStart)
                .HasColumnType("datetime")
                .HasColumnName("weekStart");

            entity.HasOne(d => d.Semester).WithMany(p => p.Weeks)
                .HasForeignKey(d => d.SemesterId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Week__semesterId__68487DD7");
        });

        modelBuilder.Entity<WeeklyEvaluation>(entity =>
        {
            entity.HasKey(e => e.WeeklyEvaluationId).HasName("PK__WeeklyEv__436009AFD9A91260");

            entity.ToTable("WeeklyEvaluation");

            entity.Property(e => e.WeeklyEvaluationId).HasColumnName("weeklyEvaluationId");
            entity.Property(e => e.ClassId).HasColumnName("classId");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("datetime")
                .HasColumnName("createdAt");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.TeacherId).HasColumnName("teacherId");
            entity.Property(e => e.TotalScore).HasColumnName("totalScore");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updatedAt");
            entity.Property(e => e.WeekId).HasColumnName("weekId");
            entity.Property(e => e.WeekNameEvaluation)
                .HasMaxLength(50)
                .HasColumnName("weekNameEvaluation");

            entity.HasOne(d => d.Class).WithMany(p => p.WeeklyEvaluations)
                .HasForeignKey(d => d.ClassId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__WeeklyEva__class__2BC97F7C");

            entity.HasOne(d => d.Teacher).WithMany(p => p.WeeklyEvaluations)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__WeeklyEva__teach__2CBDA3B5");

            entity.HasOne(d => d.Week).WithMany(p => p.WeeklyEvaluations)
                .HasForeignKey(d => d.WeekId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK__WeeklyEva__weekI__2DB1C7EE");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
