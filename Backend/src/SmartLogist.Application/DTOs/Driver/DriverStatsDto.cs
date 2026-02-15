// Об'єкт передачі даних, що містить статистичні показники роботи конкретного водія.
namespace SmartLogist.Application.DTOs.Driver;

public class DriverStatsDto
{
    public int TotalDrivers { get; set; }
    public int AvailableDrivers { get; set; }
    public int OnTripDrivers { get; set; }
    public int OfflineDrivers { get; set; }
}
