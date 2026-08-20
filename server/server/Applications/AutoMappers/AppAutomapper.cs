using System;
using AutoMapper;
using server.Dtos;
using server.Models;

namespace server.Applications.AutoMappers;

public class AppAutomapper : Profile
{
  public AppAutomapper()
  {
    CreateMap<Role, RoleDto>().ReverseMap();

    // User maps
    CreateMap<User, UserDto>().ReverseMap();
    CreateMap<User, CreateUserDto>().ReverseMap();
    CreateMap<User, UpdateUserDto>().ReverseMap();

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

    CreateMap<Week, WeekDto>().ReverseMap();

    CreateMap<Semester, SemesterDto>().ReverseMap();

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

    CreateMap<PhanCongChuNhiem, PhanCongChuNhiemDto>().ReverseMap();
    CreateMap<PhanCongChuNhiem, ExtendPhanCongChuNhiem>()
      .ForMember(dest => dest.ExtendAcademicYear, opt => opt.MapFrom(src => src.AcademicYear))
      .ForMember(dest => dest.ExtendClass, opt => opt.MapFrom(src => src.Class))
      .ForMember(dest => dest.ExtendTeacher, opt => opt.MapFrom(src => src.Teacher))
      .ForMember(dest => dest.ExtendSchool, opt => opt.MapFrom(src => src.Class.School));
  }
}
