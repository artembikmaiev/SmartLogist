namespace SmartLogist.Application.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserInfoDto User { get; set; } = null!;
}

public class UserInfoDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = string.Empty;
    public string? LicenseNumber { get; set; }
    public string? Status { get; set; }
    public DriverVehicleInfoDto? AssignedVehicle { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<PermissionDto>? Permissions { get; set; }
}

public class DriverVehicleInfoDto
{
    public int VehicleId { get; set; }
    public string Model { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public double KmUntilMaintenance { get; set; }
}

public class PermissionDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
}
