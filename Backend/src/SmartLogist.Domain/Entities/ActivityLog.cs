using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartLogist.Domain.Entities;

public class ActivityLog
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    [Required]
    [MaxLength(255)]
    public string Action { get; set; } = string.Empty;
    
    public string? Details { get; set; }
    
    [MaxLength(100)]
    public string? EntityType { get; set; }
    
    [MaxLength(100)]
    public string? EntityId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
