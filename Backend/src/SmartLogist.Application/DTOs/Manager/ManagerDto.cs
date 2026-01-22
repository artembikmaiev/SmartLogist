namespace SmartLogist.Application.DTOs.Manager;

public class ManagerDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int ActiveDriversCount { get; set; }
    public List<string> Permissions { get; set; } = new();
}
