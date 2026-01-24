using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class ManagerPermissionConfiguration : IEntityTypeConfiguration<ManagerPermission>
{
    public void Configure(EntityTypeBuilder<ManagerPermission> builder)
    {
        builder.ToTable("manager_permissions");

        builder.HasKey(mp => mp.Id);
        builder.Property(mp => mp.Id).HasColumnName("id");

        builder.Property(mp => mp.ManagerId)
            .HasColumnName("manager_id")
            .IsRequired();

        builder.Property(mp => mp.PermissionId)
            .HasColumnName("permission_id")
            .IsRequired();

        builder.Property(mp => mp.GrantedBy)
            .HasColumnName("granted_by");

        builder.Property(mp => mp.GrantedAt)
            .HasColumnName("granted_at")
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("CURRENT_TIMESTAMP");

        builder.HasIndex(mp => new { mp.ManagerId, mp.PermissionId }).IsUnique();
        builder.HasIndex(mp => mp.ManagerId).HasDatabaseName("idx_manager_permissions_manager");
        builder.HasIndex(mp => mp.PermissionId).HasDatabaseName("idx_manager_permissions_permission");

        builder.HasOne(mp => mp.Manager)
            .WithMany(u => u.ManagerPermissions)
            .HasForeignKey(mp => mp.ManagerId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(mp => mp.Permission)
            .WithMany(p => p.ManagerPermissions)
            .HasForeignKey(mp => mp.PermissionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(mp => mp.GrantedByUser)
            .WithMany()
            .HasForeignKey(mp => mp.GrantedBy)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
