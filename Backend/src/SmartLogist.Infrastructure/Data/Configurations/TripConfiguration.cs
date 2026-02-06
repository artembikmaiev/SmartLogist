using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.ToTable("trips");
        
        // Composite Key for Partitioning support
        builder.HasKey(t => new { t.Id, t.ScheduledDeparture });
        
        builder.Property(t => t.Id).HasColumnName("id").ValueGeneratedOnAdd();
        builder.Property(t => t.ScheduledDeparture).HasColumnName("scheduled_departure").HasPrecision(6);

        // Normalized Locations
        builder.Property(t => t.OriginId).HasColumnName("origin_id");
        builder.Property(t => t.DestinationId).HasColumnName("destination_id");
        
        builder.HasOne(t => t.Origin)
            .WithMany()
            .HasForeignKey(t => t.OriginId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Destination)
            .WithMany()
            .HasForeignKey(t => t.DestinationId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Property(t => t.ScheduledArrival).HasColumnName("scheduled_arrival").HasPrecision(6);
        builder.Property(t => t.ActualDeparture).HasColumnName("actual_departure").HasPrecision(6);
        builder.Property(t => t.ActualArrival).HasColumnName("actual_arrival").HasPrecision(6);

        builder.Property(t => t.PaymentAmount).HasColumnName("payment_amount").HasColumnType("numeric(12,2)");
        builder.Property(t => t.DistanceKm).HasColumnName("distance_km").HasColumnType("numeric(10,2)");
        builder.Property(t => t.Currency).HasColumnName("currency").HasMaxLength(3).IsFixedLength();
        builder.Property(t => t.Status).HasColumnName("status");
        builder.Property(t => t.Notes).HasColumnName("notes");
        builder.Property(t => t.IsMileageAccounted).HasColumnName("is_mileage_accounted").HasDefaultValue(false);
        builder.Property(t => t.CreatedAt).HasColumnName("created_at");
        builder.Property(t => t.ManagerId).HasColumnName("manager_id");
        builder.Property(t => t.DriverId).HasColumnName("driver_id");
        builder.Property(t => t.VehicleId).HasColumnName("vehicle_id");

        // Economic info (Normalized Cargo)
        builder.Property(t => t.CargoId).HasColumnName("cargo_id");
        builder.HasOne(t => t.Cargo)
            .WithMany()
            .HasForeignKey(t => t.CargoId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.Property(t => t.CargoWeight).HasColumnName("cargo_weight");
        builder.Property(t => t.ExpectedProfit).HasColumnName("expected_profit").HasColumnType("numeric(12,2)");
        builder.Property(t => t.EstimatedFuelCost).HasColumnName("estimated_fuel_cost").HasColumnType("numeric(12,2)");
        builder.Property(t => t.ActualFuelConsumption).HasColumnName("actual_fuel_consumption");
        builder.Property(t => t.FuelPrice).HasColumnName("fuel_price").HasColumnType("numeric(10,2)").HasDefaultValue(60m);

        builder.HasOne(t => t.Driver)
            .WithMany()
            .HasForeignKey(t => t.DriverId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Manager)
            .WithMany()
            .HasForeignKey(t => t.ManagerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(t => t.Vehicle)
            .WithMany()
            .HasForeignKey(t => t.VehicleId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
