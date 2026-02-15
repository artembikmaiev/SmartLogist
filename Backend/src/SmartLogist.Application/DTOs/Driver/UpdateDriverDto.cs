using SmartLogist.Domain.Enums;

// Об'єкт передачі даних для зміни інформації про водія адміністратором або менеджером.
namespace SmartLogist.Application.DTOs.Driver;

public class UpdateDriverDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? LicenseNumber { get; set; }
    public DriverStatus Status { get; set; }
    public bool IsActive { get; set; }
}
