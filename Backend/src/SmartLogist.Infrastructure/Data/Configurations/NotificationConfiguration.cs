// Цей файл налаштовує властивості та обмеження для сутності сповіщень у базі даних.
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notifications");

        builder.HasKey(n => n.Id);
        builder.Property(n => n.Id).HasColumnName("id");

        builder.Property(n => n.UserId).HasColumnName("user_id");
        builder.Property(n => n.Title).HasColumnName("title").IsRequired().HasMaxLength(255);
        builder.Property(n => n.Message).HasColumnName("message").IsRequired();
        builder.Property(n => n.Type).HasColumnName("type").HasMaxLength(50);
        builder.Property(n => n.IsRead).HasColumnName("is_read").HasDefaultValue(false);
        builder.Property(n => n.CreatedAt).HasColumnName("created_at").HasColumnType("timestamp with time zone").HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.Property(n => n.RelatedEntityType).HasColumnName("related_entity_type");
        builder.Property(n => n.RelatedEntityId).HasColumnName("related_entity_id");

        builder.HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
