namespace SmartLogist.Application.DTOs.Manager;

public class ManagerPermissionDto
{
    public int Id { get; set; }
    public int ManagerId { get; set; }
    public int PermissionId { get; set; }
    public string PermissionCode { get; set; } = string.Empty;
    public string PermissionName { get; set; } = string.Empty;
    public string PermissionCategory { get; set; } = string.Empty;
    public DateTime GrantedAt { get; set; }
    public int? GrantedBy { get; set; }
}
