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
    public double FuelConsumption { get; set; } // L/100km
    public double Height { get; set; } // meters
    public double Width { get; set; } // meters
    public double Length { get; set; } // meters
    public double Weight { get; set; } // tons
    public bool IsHazardous { get; set; } = false;
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public double TotalMileage { get; set; } = 0;
    public double MileageAtLastMaintenance { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual ICollection<DriverVehicle> AssignedDrivers { get; set; } = new List<DriverVehicle>();
}
