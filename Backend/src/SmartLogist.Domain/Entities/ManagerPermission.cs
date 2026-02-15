// Сутність-зв'язок між менеджером та конкретним дозволом, визначеним у системі.
namespace SmartLogist.Domain.Entities;

// Дозволи менеджера
public class ManagerPermission
{
    public int Id { get; set; }
    public int ManagerId { get; set; }
    public virtual User Manager { get; set; } = null!;
    public int PermissionId { get; set; }
    public virtual Permission Permission { get; set; } = null!;
    public int? GrantedBy { get; set; }
    public virtual User? GrantedByUser { get; set; }
    public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
}
