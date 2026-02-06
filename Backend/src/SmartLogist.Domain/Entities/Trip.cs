using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Entities;

public class Trip
{
    public int Id { get; set; }
    
    // Route info (Normalized)
    public int OriginId { get; set; }
    public virtual Location Origin { get; set; } = null!;
    
    public int DestinationId { get; set; }
    public virtual Location Destination { get; set; } = null!;
    
    // Schedule (DepartureTime is part of the Primary Key in SQL due to partitioning)
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
    
    // Economic info
    public int? CargoId { get; set; }
    public virtual Cargo? Cargo { get; set; }
    public float CargoWeight { get; set; }
    public decimal ExpectedProfit { get; set; }
    public decimal EstimatedFuelCost { get; set; }
    public float? ActualFuelConsumption { get; set; }
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

    // Vertical Partitioning Relations
    public virtual TripRoute? Route { get; set; }
    public virtual TripFeedback? Feedback { get; set; }
}
