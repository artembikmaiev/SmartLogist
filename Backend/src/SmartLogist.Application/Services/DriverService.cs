using SmartLogist.Application.DTOs.Driver;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;
using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public class DriverService : IDriverService
{
    private readonly IUserRepository _userRepository;
    private readonly IPermissionRepository _permissionRepository;

    public DriverService(IUserRepository userRepository, IPermissionRepository permissionRepository)
    {
        _userRepository = userRepository;
        _permissionRepository = permissionRepository;
    }

    public async Task<IEnumerable<DriverDto>> GetDriversByManagerIdAsync(int managerId)
    {
        // Перевірка, чи має менеджер дозвіл на перегляд водіїв
        var permission = await _permissionRepository.GetByCodeAsync("drivers.view");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для перегляду водіїв");
        }

        var drivers = await _userRepository.GetDriversByManagerIdAsync(managerId);
        return drivers.Select(MapToDto);
    }

    public async Task<DriverDto?> GetDriverByIdAsync(int driverId, int managerId)
    {
        // Перевірити, чи водій належить до менеджера
        var isAssigned = await _userRepository.IsDriverAssignedToManagerAsync(driverId, managerId);
        if (!isAssigned)
        {
            throw new UnauthorizedAccessException("Водій не належить цьому менеджеру");
        }

        var driver = await _userRepository.GetDriverByIdAsync(driverId);
        return driver != null ? MapToDto(driver) : null;
    }

    public async Task<DriverDto> CreateDriverAsync(CreateDriverDto dto, int managerId)
    {
        // Перевірити, чи має менеджер дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("drivers.create");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для створення водія");
        }

        // Перевірити, чи існує електронна адреса
        if (await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("Користувач з таким email вже існує");
        }

        // Створити водія
        var driver = new User
        {
            Email = dto.Email,
            FullName = dto.FullName,
            Phone = dto.Phone,
            LicenseNumber = dto.LicenseNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.Driver,
            ManagerId = managerId,
            DriverStatus = DriverStatus.Offline,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var createdDriver = await _userRepository.AddAsync(driver);
        return MapToDto(createdDriver);
    }

    public async Task<DriverDto> UpdateDriverAsync(int driverId, UpdateDriverDto dto, int managerId)
    {
        // Перевірити, чи має менеджер дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("drivers.edit");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для редагування водія");
        }

        // Перевірити, чи водій належить до менеджера
        var isAssigned = await _userRepository.IsDriverAssignedToManagerAsync(driverId, managerId);
        if (!isAssigned)
        {
            throw new UnauthorizedAccessException("Водій не належить цьому менеджеру");
        }

        var driver = await _userRepository.GetDriverByIdAsync(driverId);
        if (driver == null)
        {
            throw new KeyNotFoundException("Водія не знайдено");
        }

        // Оновити водія
        driver.FullName = dto.FullName;
        driver.Phone = dto.Phone;
        driver.LicenseNumber = dto.LicenseNumber;
        driver.DriverStatus = dto.Status;
        driver.IsActive = dto.IsActive;

        await _userRepository.UpdateAsync(driver);
        return MapToDto(driver);
    }

    public async Task DeleteDriverAsync(int driverId, int managerId)
    {
        // Check if manager has permission
        var permission = await _permissionRepository.GetByCodeAsync("drivers.delete");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для видалення водія");
        }

        // Verify driver belongs to manager
        var isAssigned = await _userRepository.IsDriverAssignedToManagerAsync(driverId, managerId);
        if (!isAssigned)
        {
            throw new UnauthorizedAccessException("Водій не належить цьому менеджеру");
        }

        await _userRepository.DeleteAsync(driverId);
    }

    public async Task<DriverStatsDto> GetDriverStatsAsync(int managerId)
    {
        // Check if manager has permission to view drivers
        var permission = await _permissionRepository.GetByCodeAsync("drivers.view");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для перегляду водіїв");
        }

        var drivers = await _userRepository.GetDriversByManagerIdAsync(managerId);
        var driversList = drivers.ToList();

        return new DriverStatsDto
        {
            TotalDrivers = driversList.Count,
            ActiveDrivers = driversList.Count(d => d.IsActive),
            OnTripDrivers = driversList.Count(d => d.DriverStatus == DriverStatus.OnTrip),
            OfflineDrivers = driversList.Count(d => d.DriverStatus == DriverStatus.Offline)
        };
    }

    private DriverDto MapToDto(User driver)
    {
        var primaryVehicle = driver.AssignedVehicles?.FirstOrDefault(dv => dv.IsPrimary);
        
        return new DriverDto
        {
            Id = driver.Id,
            Email = driver.Email,
            FullName = driver.FullName,
            Phone = driver.Phone,
            LicenseNumber = driver.LicenseNumber,
            Status = driver.DriverStatus?.ToString() ?? "Offline",
            IsActive = driver.IsActive,
            ManagerId = driver.ManagerId,
            ManagerName = driver.Manager?.FullName,
            AssignedVehicle = primaryVehicle != null ? new AssignedVehicleDto
            {
                VehicleId = primaryVehicle.VehicleId,
                Model = primaryVehicle.Vehicle?.Model ?? string.Empty,
                LicensePlate = primaryVehicle.Vehicle?.LicensePlate ?? string.Empty,
                IsPrimary = primaryVehicle.IsPrimary
            } : null,
            CreatedAt = driver.CreatedAt,
            TotalTrips = 0, // TODO: Calculate from trips table when implemented
            Rating = null // TODO: Calculate from ratings when implemented
        };
    }
}
