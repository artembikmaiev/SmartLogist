// Цей файл визначає контекст бази даних Entity Framework Core та налаштовує відображення сутностей на таблиці.
using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Набори даних (DbSets)
    public DbSet<User> Users { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<DriverVehicle> DriverVehicles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<ManagerPermission> ManagerPermissions { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<AdminRequest> AdminRequests { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Trip> Trips { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Cargo> Cargos { get; set; }
    public DbSet<TripRoute> TripRoutes { get; set; }
    public DbSet<TripFeedback> TripFeedbacks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Глобальний конвертер UTC DateTime для запобігання невідповідностей ключів партицій у Postgres
        var dateTimeConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
            v => v.Kind == DateTimeKind.Utc ? v : DateTime.SpecifyKind(v, DateTimeKind.Utc),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
            }
        }

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
