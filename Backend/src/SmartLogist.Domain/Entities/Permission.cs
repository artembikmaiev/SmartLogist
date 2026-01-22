namespace SmartLogist.Domain.Entities;

// Permission entity
public class Permission
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual ICollection<ManagerPermission> ManagerPermissions { get; set; } = new List<ManagerPermission>();
}
