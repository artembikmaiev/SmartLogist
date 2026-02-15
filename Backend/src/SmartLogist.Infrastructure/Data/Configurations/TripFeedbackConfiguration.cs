// Цей файл містить конфігурацію для сутності відгуків про рейси в базі даних.
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SmartLogist.Domain.Entities;

namespace SmartLogist.Infrastructure.Data.Configurations;

public class TripFeedbackConfiguration : IEntityTypeConfiguration<TripFeedback>
{
    public void Configure(EntityTypeBuilder<TripFeedback> builder)
    {
        builder.ToTable("trip_feedback");
        
        // Складений ключ, що відповідає секціонованим рейсам (Trips)
        builder.HasKey(tf => new { tf.TripId, tf.DepartureTime });
        
        builder.Property(tf => tf.TripId).HasColumnName("trip_id");
        builder.Property(tf => tf.DepartureTime).HasColumnName("departure_time").HasPrecision(6);
        builder.Property(tf => tf.Rating).HasColumnName("rating");
        builder.Property(tf => tf.ManagerReview).HasColumnName("manager_review");
        
        builder.HasOne(tf => tf.Trip)
            .WithOne(t => t.Feedback)
            .HasForeignKey<TripFeedback>(tf => new { tf.TripId, tf.DepartureTime })
            .OnDelete(DeleteBehavior.Cascade);
    }
}
