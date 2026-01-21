using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Entities;

// Vehicle entity

public class Vehicle
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public virtual ICollection<DriverVehicle> AssignedDrivers { get; set; } = new List<DriverVehicle>();
}
