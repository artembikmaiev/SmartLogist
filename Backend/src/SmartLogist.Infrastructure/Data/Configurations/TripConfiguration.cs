using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.ToTable("trips");
        
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasColumnName("id");

        builder.Property(t => t.OriginCity).HasColumnName("origin_city").IsRequired().HasMaxLength(100);
        builder.Property(t => t.OriginAddress).HasColumnName("origin_address").IsRequired().HasMaxLength(200);
        builder.Property(t => t.DestinationCity).HasColumnName("destination_city").IsRequired().HasMaxLength(100);
        builder.Property(t => t.DestinationAddress).HasColumnName("destination_address").IsRequired().HasMaxLength(200);
        
        builder.Property(t => t.ScheduledDeparture).HasColumnName("scheduled_departure");
        builder.Property(t => t.ScheduledArrival).HasColumnName("scheduled_arrival");
        builder.Property(t => t.ActualDeparture).HasColumnName("actual_departure");
        builder.Property(t => t.ActualArrival).HasColumnName("actual_arrival");

        builder.Property(t => t.PaymentAmount).HasColumnName("payment_amount").HasPrecision(18, 2);
        builder.Property(t => t.DistanceKm).HasColumnName("distance_km").HasPrecision(18, 2);
        builder.Property(t => t.Currency).HasColumnName("currency").HasMaxLength(10);
        builder.Property(t => t.RouteGeometry).HasColumnName("route_geometry");
        builder.Property(t => t.Status).HasColumnName("status");
        builder.Property(t => t.Notes).HasColumnName("notes");
        builder.Property(t => t.Rating).HasColumnName("rating");
        builder.Property(t => t.ManagerReview).HasColumnName("manager_review");
        builder.Property(t => t.IsMileageAccounted).HasColumnName("is_mileage_accounted").HasDefaultValue(false);
        builder.Property(t => t.CreatedAt).HasColumnName("created_at");
        builder.Property(t => t.ManagerId).HasColumnName("manager_id");
        builder.Property(t => t.DriverId).HasColumnName("driver_id");
        builder.Property(t => t.VehicleId).HasColumnName("vehicle_id");

        // ETS info
        builder.Property(t => t.CargoName).HasColumnName("cargo_name");
        builder.Property(t => t.CargoType).HasColumnName("cargo_type");
        builder.Property(t => t.CargoWeight).HasColumnName("cargo_weight");
        builder.Property(t => t.ExpectedProfit).HasColumnName("expected_profit");
        builder.Property(t => t.EstimatedFuelCost).HasColumnName("estimated_fuel_cost");
        builder.Property(t => t.ActualFuelConsumption).HasColumnName("actual_fuel_consumption");
        builder.Property(t => t.FuelPrice).HasColumnName("fuel_price").HasPrecision(18, 2).HasDefaultValue(60m);

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
