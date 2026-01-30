using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets
    public DbSet<User> Users { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<DriverVehicle> DriverVehicles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<ManagerPermission> ManagerPermissions { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }
    public DbSet<AdminRequest> AdminRequests { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Trip> Trips { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
