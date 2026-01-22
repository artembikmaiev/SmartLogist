namespace SmartLogist.Application.DTOs.Manager;

public class UpdateManagerDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; }
}
