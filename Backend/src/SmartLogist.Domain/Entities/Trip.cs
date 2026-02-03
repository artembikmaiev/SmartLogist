using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Entities;

public class Trip
{
    public int Id { get; set; }
    
    // Route info
    public string OriginCity { get; set; } = string.Empty;
    public string OriginAddress { get; set; } = string.Empty;
    public string DestinationCity { get; set; } = string.Empty;
    public string DestinationAddress { get; set; } = string.Empty;
    
    // Schedule
    public DateTime ScheduledDeparture { get; set; }
    public DateTime ScheduledArrival { get; set; }
    public DateTime? ActualDeparture { get; set; }
    public DateTime? ActualArrival { get; set; }
    
    // Financials
    public decimal PaymentAmount { get; set; }
    public string Currency { get; set; } = "UAH";
    
    // System info
    public decimal DistanceKm { get; set; }
    public string RouteGeometry { get; set; } = string.Empty; // JSON string of coordinates
    public TripStatus Status { get; set; } = TripStatus.Pending;
    public string? Notes { get; set; }
    public int? Rating { get; set; }
    public string? ManagerReview { get; set; }
    
    // ETS/Economic info
    public string? CargoName { get; set; }
    public CargoType CargoType { get; set; } = CargoType.Standard;
    public double CargoWeight { get; set; }
    public decimal ExpectedProfit { get; set; }
    public decimal EstimatedFuelCost { get; set; }
    public double? ActualFuelConsumption { get; set; }
    public decimal FuelPrice { get; set; } = 60m;
    
    public bool IsMileageAccounted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Relations
    public int DriverId { get; set; }
    public virtual User Driver { get; set; } = null!;
    
    public int? VehicleId { get; set; }
    public virtual Vehicle? Vehicle { get; set; }
    
    public int ManagerId { get; set; }
    public virtual User Manager { get; set; } = null!;
}
