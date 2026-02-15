// Цей файл є точкою входу в додаток, де налаштовуються сервіси, конфігурація та конвеєр обробки HTTP-запитів.
using Microsoft.EntityFrameworkCore;
using SmartLogist.Infrastructure.Data;
using FluentValidation;
using FluentValidation.AspNetCore;
using SmartLogist.Application.Validators.Manager;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Repositories;
using SmartLogist.Application.Interfaces;
using SmartLogist.Application.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// реєстрація контролерів ...

// налаштування CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMemoryCache();

// налаштування контексту бази даних
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// налаштування валідації
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<CreateManagerDtoValidator>();

// реєстрація репозиторіїв
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPermissionRepository, PermissionRepository>();
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IActivityRepository, ActivityRepository>();
builder.Services.AddScoped<IAdminRequestRepository, AdminRequestRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<ITripRepository, TripRepository>();
builder.Services.AddScoped<ILocationRepository, LocationRepository>();
builder.Services.AddScoped<ICargoRepository, CargoRepository>();

// реєстрація сервісів
builder.Services.AddScoped<IManagerService, ManagerService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IDriverService, DriverService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IAdminRequestService, AdminRequestService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddHttpClient<ICurrencyService, CurrencyService>();
builder.Services.AddScoped<ITripService, TripService>();
builder.Services.AddScoped<IRoadConditionService, RoadConditionService>();
builder.Services.AddScoped<IRoutingService, RoutingService>();
builder.Services.AddScoped<IAnalyticsService, AnalyticsService>();
builder.Services.AddScoped<IFuelService, FuelService>();
builder.Services.AddHttpClient();
builder.Services.AddHttpClient("TomTom", client =>
{
    client.Timeout = TimeSpan.FromSeconds(10);
});
builder.Services.AddScoped<JwtService>();

// налаштування аутентифікації JWT
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not configured");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// застосування CORS
app.UseCors("AllowFrontend");

// глобальна обробка помилок
app.UseMiddleware<SmartLogist.WebAPI.Middleware.ExceptionHandlingMiddleware>();

// перенаправлення на HTTPS (закоментовано)
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
