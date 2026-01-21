using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class DriverVehicleConfiguration : IEntityTypeConfiguration<DriverVehicle>
{
    public void Configure(EntityTypeBuilder<DriverVehicle> builder)
    {
        builder.ToTable("driver_vehicles");

        builder.HasKey(dv => dv.Id);
        builder.Property(dv => dv.Id).HasColumnName("id");

        builder.Property(dv => dv.DriverId)
            .HasColumnName("driver_id")
            .IsRequired();

        builder.Property(dv => dv.VehicleId)
            .HasColumnName("vehicle_id")
            .IsRequired();

        builder.Property(dv => dv.IsPrimary)
            .HasColumnName("is_primary")
            .HasDefaultValue(false);

        builder.Property(dv => dv.AssignedAt)
            .HasColumnName("assigned_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        // ”н≥кальний ≥ндекс - вод≥й не може бути призначений одному ≥ тому ж транспортному засобу дв≥ч≥
        builder.HasIndex(dv => new { dv.DriverId, dv.VehicleId }).IsUnique();
    }
}
