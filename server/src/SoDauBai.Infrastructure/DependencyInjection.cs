using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace SoDauBai.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Connection DB with failover mechanism
        services.AddDbContext<SoDauBaiContext>(options =>
        {
            var primaryConnectionString = configuration.GetConnectionString("SoDauBaiContext");
            var failoverConnectionString = configuration.GetConnectionString("SoDauBaiContextFailover");

            try
            {
                options.UseSqlServer(primaryConnectionString)
                    .EnableDetailedErrors();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to connect using primary connection: {ex.Message}");
                options.UseSqlServer(failoverConnectionString)
                    .EnableDetailedErrors();
            }
        });

        // Core Infrastructure & Service Registrations
        services.AddHttpContextAccessor();
        services.AddScoped<ISessionUser, SessionUser>();
        services.AddTransient<ILogManager, LoggerManager>();
        services.AddScoped<IAuths, AuthsRepositories>();
        services.AddScoped<ITokenService, TokenRepositories>();
        services.AddScoped<IRole, RoleRepositories>();
        services.AddScoped<ISchool, SchoolRepositories>();
        services.AddScoped<ITeacher, TeacherRepositories>();
        services.AddScoped<IStudent, StudentRepositories>();
        services.AddScoped<IAcademicYear, AcademicYearRepositories>();
        services.AddScoped<ISemester, SemesterRepositories>();
        services.AddScoped<ISubject, SubjectRepositories>();
        services.AddScoped<ISubject_Assgm, SubjectAssgmRepositories>();
        services.AddScoped<IGrade, GradeRepositories>();
        services.AddScoped<IClass, ClassRepositories>();
        services.AddScoped<IPhanCongGiangDaySoDauBai, PhanCongGiangDaySoDauBaiRepositories>();
        services.AddScoped<IClassification, ClassificationRepositories>();
        services.AddScoped<IBiaSoDauBai, BiaSoDauBaiRepositories>();
        services.AddScoped<IWeek, WeekRepositories>();
        services.AddScoped<IChiTietSoDauBai, ChiTietSoDauBaiRepositories>();
        services.AddScoped<IPhanCongChuNhiem, PhanCongChuNhiemRepositories>();
        services.AddScoped<IRollCall, RollCallRepositories>();
        services.AddScoped<IRollCallDetail, RollCallDetailRepositories>();
        services.AddScoped<IWeeklyEvaluation, WeeklyEvaluationRepositories>();
        services.AddScoped<IMonthlyEvaluation, MonthlyEvaluationRepositories>();
        services.AddScoped<IUser, UserRepositories>();
        services.AddScoped<IPermission, PermissionRepositories>();
        services.AddScoped<IRolePermission, RolePermissionRepositories>();
        services.AddScoped<IUserRole, UserRoleRepositories>();
        services.AddScoped<IUserPermission, UserPermissionRepositories>();

        // Cloudinary & File Upload
        services.Configure<CloudinarySetting>(configuration.GetSection("CloudinarySettings"));
        services.AddScoped<IPhotoService, PhotoRepositories>();
        services.AddScoped<IFileUploadService, FileUploadService>();

        return services;
    }
}
