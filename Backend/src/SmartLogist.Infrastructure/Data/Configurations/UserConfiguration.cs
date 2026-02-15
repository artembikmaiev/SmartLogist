// Цей файл налаштовує відображення сутності користувачів, їх персональних даних та ролей.
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).HasColumnName("id");

        builder.Property(u => u.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsRequired();

        builder.HasIndex(u => u.Email).IsUnique();

        builder.Property(u => u.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(u => u.Role)
            .HasColumnName("role")
            .HasConversion(
                v => v.ToString().ToLower(),
                v => (SmartLogist.Domain.Enums.UserRole)Enum.Parse(typeof(SmartLogist.Domain.Enums.UserRole), v, true))
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(u => u.FullName)
            .HasColumnName("full_name")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(u => u.Phone)
            .HasColumnName("phone")
            .HasMaxLength(20);

        builder.Property(u => u.IsActive)
            .HasColumnName("is_active")
            .HasDefaultValue(true);

        builder.Property(u => u.ManagerId)
            .HasColumnName("manager_id");

        builder.Property(u => u.LicenseNumber)
            .HasColumnName("license_number")
            .HasMaxLength(50);

        builder.Property(u => u.DriverStatus)
            .HasColumnName("driver_status")
            .HasConversion(
                v => v.HasValue ? ConvertDriverStatusToDb(v.Value) : null,
                v => string.IsNullOrEmpty(v) ? null : ConvertDriverStatusFromDb(v))
            .HasMaxLength(50);

        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // Зв'язки
        builder.HasOne(u => u.Manager)
            .WithMany(u => u.ManagedDrivers)
            .HasForeignKey(u => u.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(u => u.AssignedVehicles)
            .WithOne(dv => dv.Driver)
            .HasForeignKey(dv => dv.DriverId)
            .OnDelete(DeleteBehavior.Cascade);
    }

    private static string ConvertDriverStatusToDb(SmartLogist.Domain.Enums.DriverStatus status)
    {
        return status switch
        {
            SmartLogist.Domain.Enums.DriverStatus.Available => "available",
            SmartLogist.Domain.Enums.DriverStatus.OnTrip => "on-trip",
            SmartLogist.Domain.Enums.DriverStatus.Offline => "offline",
            SmartLogist.Domain.Enums.DriverStatus.OnBreak => "on-break",
            _ => "offline"
        };
    }

    private static SmartLogist.Domain.Enums.DriverStatus ConvertDriverStatusFromDb(string value)
    {
        return value switch
        {
            "available" => SmartLogist.Domain.Enums.DriverStatus.Available,
            "on-trip" => SmartLogist.Domain.Enums.DriverStatus.OnTrip,
            "offline" => SmartLogist.Domain.Enums.DriverStatus.Offline,
            "on-break" => SmartLogist.Domain.Enums.DriverStatus.OnBreak,
            _ => SmartLogist.Domain.Enums.DriverStatus.Offline
        };
    }
}
