using SmartLogist.Application.DTOs.Vehicle;

namespace SmartLogist.Application.Interfaces;

public interface IVehicleService
{
    Task<IEnumerable<VehicleDto>> GetAllVehiclesAsync(int managerId);
    Task<VehicleDto?> GetVehicleByIdAsync(int id, int managerId);
    Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto, int managerId);
    Task<VehicleDto> UpdateVehicleAsync(int id, UpdateVehicleDto dto, int managerId);
    Task DeleteVehicleAsync(int id, int managerId);
    Task AssignVehicleAsync(int id, AssignVehicleDto dto, int managerId);
    Task UnassignVehicleAsync(int id, int driverId, int managerId);
    Task<VehicleStatsDto> GetVehicleStatsAsync(int managerId);
    Task<IEnumerable<VehicleDto>> GetAllVehiclesAdminAsync();
    Task<VehicleDto> CreateVehicleAdminAsync(CreateVehicleDto dto);
    Task<VehicleDto> UpdateVehicleAdminAsync(int id, UpdateVehicleDto dto);
    Task DeleteVehicleAdminAsync(int id);
}
