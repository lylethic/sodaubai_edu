using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using server.Common.Settings;
using server.Application.Dtos;
using System.Text;
using System.Text.Json.Serialization;
using System.Data;
using server.Common.Middlewares;

var builder = WebApplication.CreateBuilder(args);
Env.Load();

// Add services to the container.
builder.Services
  .AddControllers(options => options.SuppressAsyncSuffixInActionNames = false) // keep method names with Async visible in routing for clarity or consistency
  .AddJsonOptions(options => options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles); // Prevents infinite reference loops in JSON serialization.

builder.Services.AddDbContext<server.Data.SoDauBaiContext>(options =>
{
    var primaryConnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING_SQLSERVER");

    options.UseSqlServer(primaryConnectionString)
        .EnableDetailedErrors()
        .LogTo(Console.WriteLine);
});

// Register IDbConnection that gets the connection from DbContext
builder.Services.AddScoped<IDbConnection>(provider =>
{
    var context = provider.GetRequiredService<server.Data.SoDauBaiContext>();
    return context.Database.GetDbConnection();
});

builder.Services.AddEndpointsApiExplorer();

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

builder.Services.RegisterServices();

// Load configuration from appsettings.json
var configuration = new ConfigurationBuilder()
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .Build();

//Add JWT authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"]))
        };
    });

// Cloudinary
builder.Services.Configure<CloudinarySetting>(builder.Configuration.GetSection("CloudinarySettings"));

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

builder.Services.RegisterServices();

// Add API Versioning
builder.Services.AddConfiguredApiVersioning();

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
                .AddEntityFrameworkStores<server.Data.SoDauBaiContext>();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new List<string>()
        }
    });
});


builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// ensure database and tables exist
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();
    await context.Init();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("MyCors");

app.UseRouting();
//app.UseMiddleware<JWTHeaderMiddleware>();
app.UseMiddleware<InterceptorHttpLoggingMiddleware>();
app.UseMiddleware<ErrorHandlerMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
