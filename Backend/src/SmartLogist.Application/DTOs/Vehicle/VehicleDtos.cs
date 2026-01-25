using SmartLogist.Domain.Enums;

namespace SmartLogist.Application.DTOs.Vehicle;

public class VehicleDto
{
    public int Id { get; set; }
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public double FuelConsumption { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? AssignedDriverName { get; set; }
    public int? AssignedDriverId { get; set; }
}

public class CreateVehicleDto
{
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public double FuelConsumption { get; set; }
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
}

public class UpdateVehicleDto
{
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public double FuelConsumption { get; set; }
    public VehicleStatus Status { get; set; }
}

public class AssignVehicleDto
{
    public int DriverId { get; set; }
    public bool IsPrimary { get; set; } = true;
}

public class VehicleStatsDto
{
    public int TotalVehicles { get; set; }
    public int AddedThisMonth { get; set; }
    public int InUseCount { get; set; }
    public int AvailableCount { get; set; }
    public int MaintenanceCount { get; set; }
}
