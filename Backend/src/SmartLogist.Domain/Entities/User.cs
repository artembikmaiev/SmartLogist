// Ця сутність описує користувача системи, включаючи його роль, контактні дані та зв'язки з керованими об'єктами.
using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Entities;

// Сутність користувача (Адміністратор, Менеджер, Водій)

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }  
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; } = true;
  
    public int? ManagerId { get; set; }
    public virtual User? Manager { get; set; }
    
    public string? LicenseNumber { get; set; }
    
    public DriverStatus? DriverStatus { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual ICollection<User> ManagedDrivers { get; set; } = new List<User>();
    
    public virtual ICollection<DriverVehicle> AssignedVehicles { get; set; } = new List<DriverVehicle>();
    public virtual ICollection<ManagerPermission> ManagerPermissions { get; set; } = new List<ManagerPermission>();
}
