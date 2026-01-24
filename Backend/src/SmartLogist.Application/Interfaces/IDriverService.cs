using SmartLogist.Application.DTOs.Driver;

namespace SmartLogist.Application.Interfaces;

public interface IDriverService
{
    Task<IEnumerable<DriverDto>> GetDriversByManagerIdAsync(int managerId);
    Task<DriverDto?> GetDriverByIdAsync(int driverId, int managerId);
    Task<DriverDto> CreateDriverAsync(CreateDriverDto dto, int managerId);
    Task<DriverDto> UpdateDriverAsync(int driverId, UpdateDriverDto dto, int managerId);
    Task DeleteDriverAsync(int driverId, int managerId);
    Task<DriverStatsDto> GetDriverStatsAsync(int managerId);
}
