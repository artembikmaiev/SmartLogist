using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Entities;

// Vehicle entity

public class Vehicle
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // e.g., Вантажівка
    public string FuelType { get; set; } = string.Empty; // e.g., Дизель
    public float FuelConsumption { get; set; } // REAL (L/100km)
    public float Height { get; set; } // REAL (meters)
    public float Width { get; set; } // REAL (meters)
    public float Length { get; set; } // REAL (meters)
    public float Weight { get; set; } // REAL (tons)
    public bool IsHazardous { get; set; } = false;
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public float TotalMileage { get; set; } = 0;
    public float MileageAtLastMaintenance { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual ICollection<DriverVehicle> AssignedDrivers { get; set; } = new List<DriverVehicle>();
}
