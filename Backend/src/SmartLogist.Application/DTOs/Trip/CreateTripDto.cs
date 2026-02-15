using SmartLogist.Domain.Enums;

// Об'єкт передачі даних для створення нового рейсу, включаючи параметри вантажу та маршруту.
namespace SmartLogist.Application.DTOs.Trip;

public class CreateTripDto
{
    public string OriginCity { get; set; } = string.Empty;
    public string OriginAddress { get; set; } = string.Empty;
    public double? OriginLatitude { get; set; }
    public double? OriginLongitude { get; set; }
    public string DestinationCity { get; set; } = string.Empty;
    public string DestinationAddress { get; set; } = string.Empty;
    public double? DestinationLatitude { get; set; }
    public double? DestinationLongitude { get; set; }
    public DateTime ScheduledDeparture { get; set; }
    public DateTime ScheduledArrival { get; set; }
    public decimal PaymentAmount { get; set; }
    public string Currency { get; set; } = "UAH";
    public decimal DistanceKm { get; set; }
    public int DriverId { get; set; }
    public int? VehicleId { get; set; }
    public string? Notes { get; set; }
    
    // ETS/Economic info
    public string? CargoName { get; set; }
    public CargoType CargoType { get; set; }
    public float CargoWeight { get; set; }
    public decimal ExpectedProfit { get; set; }
    public decimal EstimatedFuelCost { get; set; }
    public string RouteGeometry { get; set; } = string.Empty;
}
