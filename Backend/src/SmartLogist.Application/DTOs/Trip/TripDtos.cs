using SmartLogist.Domain.Enums;

namespace SmartLogist.Application.DTOs.Trip;

public class TripDto
{
    public int Id { get; set; }
    public string OriginCity { get; set; } = string.Empty;
    public string OriginAddress { get; set; } = string.Empty;
    public string DestinationCity { get; set; } = string.Empty;
    public string DestinationAddress { get; set; } = string.Empty;
    public DateTime ScheduledDeparture { get; set; }
    public DateTime ScheduledArrival { get; set; }
    public DateTime? ActualDeparture { get; set; }
    public DateTime? ActualArrival { get; set; }
    public decimal PaymentAmount { get; set; }
    public string Currency { get; set; } = "UAH";
    public decimal DistanceKm { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    
    public int ManagerId { get; set; }
    public string ManagerName { get; set; } = string.Empty;
    
    public int? VehicleId { get; set; }
    public string? VehicleModel { get; set; }
    public string? VehicleLicensePlate { get; set; }
}

public class DriverStatsSummaryDto
{
    public int CurrentTripsCount { get; set; }
    public int CompletedTripsCount { get; set; }
    public decimal TotalDistance { get; set; }
    public decimal TotalEarnings { get; set; }
    public string EarningsSubtitle { get; set; } = string.Empty; // e.g. "грн цього місяця"
}
