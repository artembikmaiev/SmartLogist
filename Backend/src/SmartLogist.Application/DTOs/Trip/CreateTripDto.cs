using SmartLogist.Domain.Enums;

namespace SmartLogist.Application.DTOs.Trip;

public class CreateTripDto
{
    public string OriginCity { get; set; } = string.Empty;
    public string OriginAddress { get; set; } = string.Empty;
    public string DestinationCity { get; set; } = string.Empty;
    public string DestinationAddress { get; set; } = string.Empty;
    public DateTime ScheduledDeparture { get; set; }
    public DateTime ScheduledArrival { get; set; }
    public decimal PaymentAmount { get; set; }
    public string Currency { get; set; } = "UAH";
    public decimal DistanceKm { get; set; }
    public int DriverId { get; set; }
    public int? VehicleId { get; set; }
    public string? Notes { get; set; }
}
