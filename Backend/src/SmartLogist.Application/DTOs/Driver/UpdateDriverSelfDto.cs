// Об'єкт передачі даних для самостійного оновлення водієм власної контактної інформації.
namespace SmartLogist.Application.DTOs.Driver;

public class UpdateDriverSelfDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? LicenseNumber { get; set; }
}
