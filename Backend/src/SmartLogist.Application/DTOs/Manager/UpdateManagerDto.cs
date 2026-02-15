// Об'єкт передачі даних для зміни інформації про існуючого менеджера.
namespace SmartLogist.Application.DTOs.Manager;

public class UpdateManagerDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; }
}
