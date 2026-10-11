using System;
using AutoMapper;
using SoDauBai.Domain.Entities;
using SoDauBai.Application.DTOs;
using System.ComponentModel;
using Microsoft.AspNetCore.SignalR;

namespace SoDauBai.Application.Mappings;

public class AppAutomapper : Profile
{
    public AppAutomapper()
    {
        CreateMap<Role, RoleDto>().ReverseMap();

        // User maps
        CreateMap<User, UserDto>().ReverseMap();
        CreateMap<User, UserCreateBody>().ReverseMap();
        CreateMap<User, UpdateUserDto>().ReverseMap();
        CreateMap<User, ExtendUserBody>().ForMember(dest => dest.ExtendSchool, opt => opt.MapFrom(src => src.School));
        CreateMap<User, MyInfoDto>()
          .ForMember(dest => dest.SchoolName, opt => opt.MapFrom(src => src.School != null ? src.School.Name : null))
          .ForMember(dest => dest.TeacherId, opt => opt.MapFrom(src => src.TeacherUsers.FirstOrDefault() != null ? src.TeacherUsers.FirstOrDefault()!.Id : (int?)null))
          .ForMember(dest => dest.Fullname, opt => opt.MapFrom(src => src.TeacherUsers.FirstOrDefault() != null ? src.TeacherUsers.FirstOrDefault()!.Fullname : null))
          .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.TeacherUsers.FirstOrDefault() != null ? src.TeacherUsers.FirstOrDefault()!.DateOfBirth : (DateTime?)null))
          .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.TeacherUsers.FirstOrDefault() != null ? src.TeacherUsers.FirstOrDefault()!.Gender : (bool?)null))
          .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.TeacherUsers.FirstOrDefault() != null ? src.TeacherUsers.FirstOrDefault()!.Address : null))
          .ForMember(dest => dest.PhotoPath, opt => opt.MapFrom(src => src.TeacherUsers.FirstOrDefault() != null ? src.TeacherUsers.FirstOrDefault()!.PhotoPath : null))
          .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.TeacherUsers.FirstOrDefault() != null ? src.TeacherUsers.FirstOrDefault()!.Status : (bool?)null));

        // Permission maps
        CreateMap<Permission, PermissionDto>().ReverseMap();
        CreateMap<Permission, CreatePermissionDto>().ReverseMap();
        CreateMap<Permission, UpdatePermissionDto>().ReverseMap();

        // RolePermission maps
        CreateMap<RolePermission, RolePermissionDto>().ReverseMap();
        CreateMap<RolePermission, CreateRolePermissionDto>().ReverseMap();
        CreateMap<RolePermission, UpdateRolePermissionDto>().ReverseMap();

        // UserRole maps
        CreateMap<UserRole, UserRoleDto>().ReverseMap();
        CreateMap<UserRole, CreateUserRoleDto>().ReverseMap();
        CreateMap<UserRole, UpdateUserRoleDto>().ReverseMap();

        // UserPermission maps
        CreateMap<UserPermission, UserPermissionDto>().ReverseMap();
        CreateMap<UserPermission, CreateUserPermissionDto>().ReverseMap();
        CreateMap<UserPermission, UpdateUserPermissionDto>().ReverseMap();

        // School
        CreateMap<School, SchoolDto>().ReverseMap();
        CreateMap<School, ExtendSchool>().ReverseMap();

        CreateMap<AcademicYear, AcademicYearDto>().ReverseMap();

        CreateMap<Grade, GradeDto>().ReverseMap();
        CreateMap<Grade, GradeDetail>().ReverseMap();
        CreateMap<Grade, ExtendGrade>().ReverseMap();

        CreateMap<BiaSoDauBai, BiaSoDauBaiDto>().ReverseMap();
        CreateMap<BiaSoDauBai, ExtendBiaSoDauBai>()
            .ForMember(dest => dest.ExtendAcademicYear, opt => opt.MapFrom(src => src.Academicyear))
            .ForMember(dest => dest.ExtendSchool, opt => opt.MapFrom(src => src.School))
            .ForMember(dest => dest.ExtendClass, opt => opt.MapFrom(src => src.Class));

        CreateMap<AcademicYear, ExtendAcademicYear>().ReverseMap();
        CreateMap<School, ExtendSchool>().ReverseMap();
        CreateMap<Class, ExtendClass>().ReverseMap();

        CreateMap<Class, ClassDto>().ReverseMap();

        CreateMap<Week, WeekDto>()
          .ForMember(dest => dest.WeekId, opt => opt.MapFrom(src => src.Id))
          .ForMember(dest => dest.WeekName, opt => opt.MapFrom(src => src.Name))
          .ReverseMap()
          .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.WeekId))
          .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.WeekName));

        CreateMap<Week, ExtendWeek>()
          .ForMember(dest => dest.ExtendSemester, opt => opt.MapFrom(src => src.Semester))
          .ReverseMap();

        CreateMap<Semester, SemesterDto>().ReverseMap();
        CreateMap<Semester, ExtendSemester>().ReverseMap();

        CreateMap<Subject, SubjectDto>().ReverseMap();
        CreateMap<Subject, ExtendSubject>()
          .ForMember(dest => dest.ExtendGrade, opt => opt.MapFrom(src => src.Grade));

        CreateMap<Classification, ClassificationDto>().ReverseMap();
        CreateMap<Classification, ExtendClassification>().ReverseMap();

        CreateMap<ChiTietSoDauBai, ChiTietSoDauBaiDto>().ReverseMap();

        CreateMap<ChiTietSoDauBai, ExtendChiTietSoDauBai>()
            .ForMember(dest => dest.ExtendBiaSoDauBai, opt => opt.MapFrom(src => src.BiaSoDauBai))
            .ForMember(dest => dest.ExtendClassification, opt => opt.MapFrom(src => src.Classification))
            .ForMember(dest => dest.ExtendSemester, opt => opt.MapFrom(src => src.Semester))
            .ForMember(dest => dest.ExtendSubject, opt => opt.MapFrom(src => src.Subject))
            .ForMember(dest => dest.ExtendWeek, opt => opt.MapFrom(src => src.Week))
            .ForMember(dest => dest.ExtendUser, opt => opt.MapFrom(src => src.CreatedByNavigation));

        CreateMap<Teacher, TeacherDto>().ReverseMap();
        CreateMap<Teacher, ExtendTeacher>().ReverseMap();
        CreateMap<Teacher, TeacherCreateBody>().ReverseMap();
        CreateMap<Teacher, TeacherDto>()
          .ForMember(dest => dest.ExtendUser, opt => opt.MapFrom(src => src.User))
          .ForMember(dest => dest.ExtendSchool, opt => opt.MapFrom(src => src.School));

        CreateMap<PhanCongChuNhiem, PhanCongChuNhiemDto>().ReverseMap();
        CreateMap<PhanCongChuNhiem, ExtendPhanCongChuNhiem>()
          .ForMember(dest => dest.ExtendAcademicYear, opt => opt.MapFrom(src => src.AcademicYear))
          .ForMember(dest => dest.ExtendClass, opt => opt.MapFrom(src => src.Class))
          .ForMember(dest => dest.ExtendTeacher, opt => opt.MapFrom(src => src.Teacher))
          .ForMember(dest => dest.ExtendSchool, opt => opt.MapFrom(src => src.Class.School));

        CreateMap<Student, StudentDto>().ReverseMap();
        CreateMap<Student, StudentDetail>().ReverseMap();

        CreateMap<SubjectAssignment, SubjectAssgmDto>()
          .ForMember(dest => dest.SubjectAssignmentId, opt => opt.MapFrom(src => src.Id))
          .ReverseMap()
          .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.SubjectAssignmentId));
        CreateMap<SubjectAssignment, SubjectAssgmDetail>()
          .ForMember(dest => dest.SubjectAssignmentId, opt => opt.MapFrom(src => src.Id))
          .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject.Name))
          .ForMember(dest => dest.Fullname, opt => opt.MapFrom(src => src.Teacher.Fullname))
          .ReverseMap();

        CreateMap<PhanCongGiangDay, PC_GiangDay_BiaSDBDto>()
          .ForMember(dest => dest.PhanCongGiangDayId, opt => opt.MapFrom(src => src.Id))
          .ReverseMap()
          .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.PhanCongGiangDayId));

        CreateMap<RollCall, RollCallDto>()
          .ForMember(dest => dest.CallRollId, opt => opt.MapFrom(src => src.Id))
          .ReverseMap()
          .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CallRollId));

        CreateMap<RollCallDetail, RollCallDetailDto>().ReverseMap();

        CreateMap<WeeklyEvaluation, WeeklyEvaluationDto>()
          .ForMember(dest => dest.WeeklyEvaluationId, opt => opt.MapFrom(src => src.Id))
          .ForMember(dest => dest.WeekNameEvaluation, opt => opt.MapFrom(src => src.Name))
          .ReverseMap()
          .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.WeeklyEvaluationId))
          .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.WeekNameEvaluation));

        CreateMap<MonthlyEvaluation, MonthlyEvaluationDto>()
          .ForMember(dest => dest.MonthlyEvaluationId, opt => opt.MapFrom(src => src.Id))
          .ReverseMap()
          .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.MonthlyEvaluationId));
    }
}
