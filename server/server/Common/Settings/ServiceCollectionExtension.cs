using server.Application.Interfaces;
using server.Repositories;

namespace server.Common.Settings;

public static class ServiceCollectionExtension
{
    public static void RegisterServices(this IServiceCollection services)
    {
        services.AddSingleton<DataContext>();
        services.AddScoped<IAuth, AuthRepositories>();
        services.AddScoped<ITokenService, TokenRepositories>();
        services.AddScoped<IAccount, AccountRespositories>();
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
        services.AddScoped<IClassify, ClassifyRepositories>();
        services.AddScoped<IBiaSoDauBai, BiaSoDauBaiRepositories>();
        services.AddScoped<IWeek, WeekRepositories>();
        services.AddScoped<IChiTietSoDauBai, ChiTietSoDauBaiRepositories>();
        services.AddScoped<IPC_ChuNhiem, PCChuNhiemRepositories>();
        services.AddScoped<IRollCall, RollCallRepositories>();
        services.AddScoped<IRollCallDetail, RollCallDetailRepositories>();
        services.AddScoped<IWeeklyEvaluation, WeeklyEvaluationRepositories>();
        services.AddScoped<IMonthlyEvaluation, MonthlyEvaluationRepositories>();
        services.AddScoped<IPhotoService, PhotoRepositories>();
    }
}
