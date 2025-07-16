using AutoMapper;
using server.Domain.Entities;
using server.Application.Dtos;

namespace server.Common.AutoMappers
{
    public class RoleProfile : Profile
    {
        public RoleProfile()
        {
            CreateMap<RoleDto, Role>();
        }
    }
}
