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

    CreateMap<BiaSoDauBai, BiaSoDauBaiDto>().ReverseMap();
    CreateMap<BiaSoDauBai, ExtendBiaSoDauBai>()
        .ForMember(dest => dest.ExtendAcademicYear, opt => opt.MapFrom(src => src.Academicyear))
        .ForMember(dest => dest.ExtendSchool, opt => opt.MapFrom(src => src.School))
        .ForMember(dest => dest.ExtendClass, opt => opt.MapFrom(src => src.Class));
        
    CreateMap<AcademicYear, ExtendAcademicYear>().ReverseMap();
    CreateMap<School, ExtendSchool>().ReverseMap();
    CreateMap<Class, ExtendClass>().ReverseMap();

    CreateMap<Class, ClassDto>().ReverseMap();
  }
}
