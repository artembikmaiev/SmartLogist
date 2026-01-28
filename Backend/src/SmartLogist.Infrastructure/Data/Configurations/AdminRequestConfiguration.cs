using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class AdminRequestConfiguration : IEntityTypeConfiguration<AdminRequest>
{
    public void Configure(EntityTypeBuilder<AdminRequest> builder)
    {
        builder.ToTable("admin_requests");

        builder.HasKey(r => r.Id);
        builder.Property(r => r.Id).HasColumnName("id");

        builder.Property(r => r.Type)
            .HasColumnName("type")
            .IsRequired();

        builder.Property(r => r.Status)
            .HasColumnName("status")
            .IsRequired();

        builder.Property(r => r.RequesterId)
            .HasColumnName("requester_id")
            .IsRequired();

        builder.Property(r => r.TargetId)
            .HasColumnName("target_id");

        builder.Property(r => r.TargetName)
            .HasColumnName("target_name")
            .IsRequired();

        builder.Property(r => r.Comment)
            .HasColumnName("comment")
            .IsRequired();

        builder.Property(r => r.AdminResponse)
            .HasColumnName("admin_response");

        builder.Property(r => r.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("timestamp without time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.Property(r => r.ProcessedAt)
            .HasColumnName("processed_at")
            .HasColumnType("timestamp without time zone");

        builder.Property(r => r.ProcessedById)
            .HasColumnName("processed_by_id");

        // Relationships
        builder.HasOne(r => r.Requester)
            .WithMany()
            .HasForeignKey(r => r.RequesterId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.ProcessedBy)
            .WithMany()
            .HasForeignKey(r => r.ProcessedById)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
