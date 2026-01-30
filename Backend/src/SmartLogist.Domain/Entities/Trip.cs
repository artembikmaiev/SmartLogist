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
    public TripStatus Status { get; set; } = TripStatus.Pending;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Relations
    public int DriverId { get; set; }
    public virtual User Driver { get; set; } = null!;
    
    public int? VehicleId { get; set; }
    public virtual Vehicle? Vehicle { get; set; }
    
    public int ManagerId { get; set; }
    public virtual User Manager { get; set; } = null!;
}
