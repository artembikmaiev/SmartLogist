// Цей файл містить конфігурацію сутності маршруту рейсу для Entity Framework Core.
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class TripRouteConfiguration : IEntityTypeConfiguration<TripRoute>
{
    public void Configure(EntityTypeBuilder<TripRoute> builder)
    {
        builder.ToTable("trip_routes");
        
        // Складений ключ, що відповідає секціонованим рейсам
        builder.HasKey(tr => new { tr.TripId, tr.DepartureTime });
        
        builder.Property(tr => tr.TripId).HasColumnName("trip_id");
        builder.Property(tr => tr.DepartureTime).HasColumnName("departure_time").HasPrecision(6);
        builder.Property(tr => tr.RouteGeometry).HasColumnName("route_geometry").HasColumnType("jsonb");
        
        builder.HasOne(tr => tr.Trip)
            .WithOne(t => t.Route)
            .HasForeignKey<TripRoute>(tr => new { tr.TripId, tr.DepartureTime })
            .OnDelete(DeleteBehavior.Cascade);
    }
}
