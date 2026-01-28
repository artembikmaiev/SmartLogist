namespace SmartLogist.Application.DTOs.Driver;

public class DriverDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? LicenseNumber { get; set; }
    public string Status { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int? ManagerId { get; set; }
    public string? ManagerName { get; set; }
    public AssignedVehicleDto? AssignedVehicle { get; set; }
    public DateTime CreatedAt { get; set; }
    public int TotalTrips { get; set; }
    public double? Rating { get; set; }
    public bool HasPendingDeletion { get; set; }
    public bool HasPendingUpdate { get; set; }
}

public class AssignedVehicleDto
{
    public int VehicleId { get; set; }
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}
