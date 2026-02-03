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
    public double Height { get; set; }
    public double Width { get; set; }
    public double Length { get; set; }
    public double Weight { get; set; }
    public bool IsHazardous { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string? AssignedDriverName { get; set; }
    public int? AssignedDriverId { get; set; }
    public bool HasPendingDeletion { get; set; }
    public bool HasPendingUpdate { get; set; }
    public double TotalMileage { get; set; }
    public double MileageAtLastMaintenance { get; set; }
    public double KmUntilMaintenance { get; set; }
}

public class CreateVehicleDto
{
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public double FuelConsumption { get; set; }
    public double Height { get; set; }
    public double Width { get; set; }
    public double Length { get; set; }
    public double Weight { get; set; }
    public bool IsHazardous { get; set; }
    public VehicleStatus Status { get; set; } = VehicleStatus.Available;
    public double TotalMileage { get; set; } = 0;
    public double MileageAtLastMaintenance { get; set; } = 0;
}

public class UpdateVehicleDto
{
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public double FuelConsumption { get; set; }
    public double Height { get; set; }
    public double Width { get; set; }
    public double Length { get; set; }
    public double Weight { get; set; }
    public bool IsHazardous { get; set; }
    public VehicleStatus Status { get; set; }
    public double TotalMileage { get; set; }
    public double MileageAtLastMaintenance { get; set; }
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
