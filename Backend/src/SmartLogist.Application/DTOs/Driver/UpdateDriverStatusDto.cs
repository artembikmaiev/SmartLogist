// Об'єкт передачі даних для зміни робочого статусу водія (наприклад, доступний або на рейсі).
using SmartLogist.Domain.Enums;

namespace SmartLogist.Application.DTOs.Driver;

public class UpdateDriverStatusDto
{
    public DriverStatus Status { get; set; }
}
