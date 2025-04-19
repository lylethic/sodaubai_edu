using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server;
using server.Dtos;
using server.IService;
using server.Repositories;
using System.Text;
using System.Text.Json.Serialization;
var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();


// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
   options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Connection DB Local
// builder.Services.AddDbContext<server.Data.SoDauBaiContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("SoDauBaiContext"))
//     .EnableDetailedErrors()
//     .LogTo(Console.WriteLine));

// Connection DB with failover mechanism
// Connection DB with failover mechanism
builder.Services.AddDbContext<server.Data.SoDauBaiContext>(options =>
{
  // Get connection strings
  var primaryConnectionString = builder.Configuration.GetConnectionString("SoDauBaiContext");
  var failoverConnectionString = builder.Configuration.GetConnectionString("SoDauBaiContextFailover");

  try
  {
    options.UseSqlServer(primaryConnectionString)
        .EnableDetailedErrors()
        .LogTo(Console.WriteLine);

    // This line is causing the error - we need to use a different approach
    // using var context = new server.Data.SoDauBaiContext(options.Options);
    // context.Database.OpenConnection();
    // context.Database.CloseConnection();
  }
  catch (Exception ex)
  {
    Console.WriteLine($"Failed to connect using primary connection: {ex.Message}");

    // Use the failover connection string
    options.UseSqlServer(failoverConnectionString)
        .EnableDetailedErrors()
        .LogTo(Console.WriteLine);
  }
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// **CORS Configuration**
builder.Services.AddCors(options =>
{
  options.AddPolicy("MyCors", policy =>
  {
    policy.WithOrigins("http://localhost:3000", "http://localhost:3001")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials(); // Allow credentials
  });
});

// Inject app Dependencies (Dependecy Injecteion)
builder.Services.AddScoped<IAuth, AuthRepositories>();
builder.Services.AddScoped<ITokenService, TokenRepositories>();
builder.Services.AddScoped<IAccount, AccountRespositories>();
builder.Services.AddScoped<IRole, RoleRepositories>();
builder.Services.AddScoped<ISchool, SchoolRepositories>();
builder.Services.AddScoped<ITeacher, TeacherRepositories>();
builder.Services.AddScoped<IStudent, StudentRepositories>();
builder.Services.AddScoped<IAcademicYear, AcademicYearRepositories>();
builder.Services.AddScoped<ISemester, SemesterRepositories>();
builder.Services.AddScoped<ISubject, SubjectRepositories>();
builder.Services.AddScoped<ISubject_Assgm, SubjectAssgmRepositories>();
builder.Services.AddScoped<IGrade, GradeRepositories>();
builder.Services.AddScoped<IClass, ClassRepositories>();
builder.Services.AddScoped<IPhanCongGiangDaySoDauBai, PhanCongGiangDaySoDauBaiRepositories>();
builder.Services.AddScoped<IClassify, ClassifyRepositories>();
builder.Services.AddScoped<IBiaSoDauBai, BiaSoDauBaiRepositories>();
builder.Services.AddScoped<IWeek, WeekRepositories>();
builder.Services.AddScoped<IChiTietSoDauBai, ChiTietSoDauBaiRepositories>();
builder.Services.AddScoped<IPC_ChuNhiem, PCChuNhiemRepositories>();
builder.Services.AddScoped<IRollCall, RollCallRepositories>();
builder.Services.AddScoped<IRollCallDetail, RollCallDetailRepositories>();
builder.Services.AddScoped<IWeeklyEvaluation, WeeklyEvaluationRepositories>();
builder.Services.AddScoped<IMonthlyEvaluation, MonthlyEvaluationRepositories>();


// Load configuration from appsettings.json
var configuration = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

//Add JWT authentication
builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.SaveToken = true;
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = true,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = configuration["JwtSettings:Issuer"],
    ValidAudience = configuration["JwtSettings:Audience"],
    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtSettings:SecretKey"]!))
  };
});


// Cloudinary
builder.Services.Configure<CloudinarySetting>
  (builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddScoped<IPhotoService, PhotoRepositories>();

// Add AutoMapper and configure profiles
builder.Services.AddAutoMapper(typeof(Program));

// Add authorization with a custom policy to check RoleId
builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("SuperAdmin", policy =>
  {
    policy.RequireClaim("RoleId", "7");
  });

  options.AddPolicy("Admin", policy =>
  {
    policy.RequireClaim("RoleId", "6");
  });

  options.AddPolicy("Teacher", policy =>
  {
    policy.RequireClaim("RoleId", "2");
  });

  options.AddPolicy("Student", policy =>
  {
    policy.RequireClaim("RoleId", "1");
  });

  options.AddPolicy("AdminAndTeacher", policy =>
  {
    policy.RequireClaim("RoleId", "2", "6");
  });

  options.AddPolicy("SuperAdminAndAdmin", policy =>
  {
    policy.RequireClaim("RoleId", "6", "7");
  });
});


builder.Services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<server.Data.SoDauBaiContext>();

//
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors("MyCors");

app.UseRouting();
app.UseMiddleware<JWTHeaderMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
