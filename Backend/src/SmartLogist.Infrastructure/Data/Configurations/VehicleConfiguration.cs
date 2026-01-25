using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class VehicleConfiguration : IEntityTypeConfiguration<Vehicle>
{
    public void Configure(EntityTypeBuilder<Vehicle> builder)
    {
        builder.ToTable("vehicles");

        builder.HasKey(v => v.Id);
        builder.Property(v => v.Id).HasColumnName("id");

        builder.Property(v => v.Model)
            .HasColumnName("model")
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(v => v.LicensePlate)
            .HasColumnName("license_plate")
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(v => v.LicensePlate).IsUnique();

        builder.Property(v => v.Type)
            .HasColumnName("type")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(v => v.FuelType)
            .HasColumnName("fuel_type")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(v => v.FuelConsumption)
            .HasColumnName("fuel_consumption")
            .IsRequired();

        builder.Property(v => v.Status)
            .HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(v => v.CreatedAt)
            .HasColumnName("created_at")
            .HasDefaultValueSql("CURRENT_TIMESTAMP")
            .ValueGeneratedOnAdd();

        // Relationships
        builder.HasMany(v => v.AssignedDrivers)
            .WithOne(dv => dv.Vehicle)
            .HasForeignKey(dv => dv.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
