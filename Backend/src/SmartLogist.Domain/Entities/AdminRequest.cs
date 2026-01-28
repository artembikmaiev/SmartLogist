using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Entities;

public class AdminRequest
{
    public int Id { get; set; }
    public RequestType Type { get; set; }
    public RequestStatus Status { get; set; } = RequestStatus.Pending;
    
    public int RequesterId { get; set; }
    public virtual User Requester { get; set; } = null!;
    
    public int? TargetId { get; set; }
    public string TargetName { get; set; } = string.Empty; 
    
    public string Comment { get; set; } = string.Empty;
    public string? AdminResponse { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public int? ProcessedById { get; set; }
    public virtual User? ProcessedBy { get; set; }
}
