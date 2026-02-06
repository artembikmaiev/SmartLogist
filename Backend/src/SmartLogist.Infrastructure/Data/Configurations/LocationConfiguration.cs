using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> builder)
    {
        builder.ToTable("locations");
        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id).HasColumnName("id");
        builder.Property(l => l.City).HasColumnName("city").HasMaxLength(255).IsRequired();
        builder.Property(l => l.Address).HasColumnName("address").HasMaxLength(255).IsRequired();
        builder.Property(l => l.Latitude).HasColumnName("latitude");
        builder.Property(l => l.Longitude).HasColumnName("longitude");
        
        builder.HasIndex(l => new { l.City, l.Address }).IsUnique();
    }
}
