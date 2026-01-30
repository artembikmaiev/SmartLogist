using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class TripConfiguration : IEntityTypeConfiguration<Trip>
{
    public void Configure(EntityTypeBuilder<Trip> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.OriginCity).IsRequired().HasMaxLength(100);
        builder.Property(t => t.OriginAddress).IsRequired().HasMaxLength(200);
        builder.Property(t => t.DestinationCity).IsRequired().HasMaxLength(100);
        builder.Property(t => t.DestinationAddress).IsRequired().HasMaxLength(200);

        builder.Property(t => t.PaymentAmount).HasPrecision(18, 2);
        builder.Property(t => t.DistanceKm).HasPrecision(18, 2);
        builder.Property(t => t.Currency).HasMaxLength(10);

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
