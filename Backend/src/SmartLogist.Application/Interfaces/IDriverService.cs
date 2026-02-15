// Інтерфейс сервісу для управління даними водіїв та їх робочим статусом.
using SmartLogist.Application.DTOs.Driver;
using SmartLogist.Domain.Enums;

namespace SmartLogist.Application.Interfaces;

public interface IDriverService
{
    Task<IEnumerable<DriverDto>> GetDriversByManagerIdAsync(int managerId);
    Task<DriverDto?> GetDriverByIdAsync(int driverId, int managerId);
    Task<DriverDto> CreateDriverAsync(CreateDriverDto dto, int managerId);
    Task<DriverDto> UpdateDriverAsync(int driverId, UpdateDriverDto dto, int managerId);
    Task DeleteDriverAsync(int driverId, int managerId);
    Task UpdateStatusAsync(int driverId, DriverStatus status);
    Task<DriverDto> UpdateSelfAsync(int driverId, UpdateDriverSelfDto dto);
    Task<DriverStatsDto> GetDriverStatsAsync(int managerId);

    // Admin methods
    Task<IEnumerable<DriverDto>> GetAllDriversAdminAsync();
    Task<DriverDto?> GetDriverByIdAdminAsync(int driverId);
    Task<DriverDto> CreateDriverAdminAsync(CreateDriverDto dto);
    Task<DriverDto> UpdateDriverAdminAsync(int driverId, UpdateDriverDto dto);
    Task DeleteDriverAdminAsync(int driverId);
    Task<DriverStatsDto> GetAdminDriverStatsAsync();
    Task AssignManagerAsync(int driverId, int? managerId);
    Task AssignVehicleAsync(int driverId, int vehicleId);
    Task UnassignVehicleAsync(int driverId, int vehicleId);
}
