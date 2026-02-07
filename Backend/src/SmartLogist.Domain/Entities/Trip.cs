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

    // Domain Methods
    public void Accept(int driverId)
    {
        if (Status != TripStatus.Pending)
            throw new InvalidOperationException("Рейс не можна прийняти в даному статусі");
        
        if (DriverId != driverId)
             throw new UnauthorizedAccessException("Цей рейс призначено іншому водію");

        Status = TripStatus.Accepted;
    }

    public void Decline(int driverId)
    {
        if (Status != TripStatus.Pending)
            throw new InvalidOperationException("Рейс не можна відхилити в даному статусі");

        if (DriverId != driverId)
             throw new UnauthorizedAccessException("Цей рейс призначено іншому водію");

        Status = TripStatus.Declined;
    }

    public void Start()
    {
        if (Status != TripStatus.Accepted)
            throw new InvalidOperationException("Рейс повинен бути прийнятий перед початком");

        Status = TripStatus.InTransit;
        ActualDeparture = DateTime.UtcNow;
    }

    public void Arrive()
    {
        if (Status != TripStatus.InTransit)
            throw new InvalidOperationException("Рейс повинен бути в дорозі");

        Status = TripStatus.Arrived;
        ActualArrival = DateTime.UtcNow;
    }

    public void Complete(float? actualFuelConsumption, string? managerReview = null, int? rating = null)
    {
        if (Status != TripStatus.Arrived && Status != TripStatus.InTransit)
             throw new InvalidOperationException("Рейс повинен бути завершений або прибути перед закриттям");

        Status = TripStatus.Completed;
        if (ActualArrival == null) ActualArrival = DateTime.UtcNow;

        if (actualFuelConsumption.HasValue)
        {
            UpdateFuelStats(actualFuelConsumption.Value);
        }

        if (rating.HasValue || managerReview != null)
        {
            AddFeedback(rating, managerReview);
        }
    }

    public void Cancel(string reason)
    {
        if (Status == TripStatus.Completed)
            throw new InvalidOperationException("Не можна скасувати вже завершений рейс");

        Status = TripStatus.Cancelled;
        Notes = string.IsNullOrEmpty(Notes) ? $"Скасовано: {reason}" : $"{Notes}\nСкасовано: {reason}";
    }

    public void UpdateFuelStats(float actualFuelConsumption)
    {
        ActualFuelConsumption = actualFuelConsumption;
        var realFuelCost = (DistanceKm / 100m) * (decimal)actualFuelConsumption * FuelPrice;
        var oldFuelCost = EstimatedFuelCost;
        EstimatedFuelCost = Math.Round(realFuelCost, 2);
        // Recalculate profit based on difference
        ExpectedProfit = ExpectedProfit + (oldFuelCost - EstimatedFuelCost);
    }

    public void AddFeedback(int? rating, string? review)
    {
        if (Feedback == null)
        {
            Feedback = new TripFeedback
            {
                DepartureTime = ScheduledDeparture,
                Rating = rating,
                ManagerReview = review
            };
        }
        else
        {
            if (rating.HasValue) Feedback.Rating = rating;
            if (review != null) Feedback.ManagerReview = review;
        }
    }
}
