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
    private readonly IActivityService _activityService;
    private readonly IVehicleRepository _vehicleRepository;

    public DriverService(
        IUserRepository userRepository, 
        IPermissionRepository permissionRepository,
        IActivityService activityService,
        IVehicleRepository vehicleRepository)
    {
        _userRepository = userRepository;
        _permissionRepository = permissionRepository;
        _activityService = activityService;
        _vehicleRepository = vehicleRepository;
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

        await _activityService.LogAsync(
            managerId, 
            "Додано нового водія", 
            createdDriver.FullName, 
            "Driver", 
            createdDriver.Id.ToString()
        );

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

        await _activityService.LogAsync(
            managerId, 
            "Оновлено дані водія", 
            driver.FullName, 
            "Driver", 
            driver.Id.ToString()
        );

        return MapToDto(driver);
    }

    public async Task DeleteDriverAsync(int driverId, int managerId)
    {
        // Перевірити, чи має менеджер дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("drivers.delete");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для видалення водія");
        }

        // Перевірити, чи водій належить до менеджера
        var isAssigned = await _userRepository.IsDriverAssignedToManagerAsync(driverId, managerId);
        if (!isAssigned)
        {
            throw new UnauthorizedAccessException("Водій не належить цьому менеджеру");
        }

        var driver = await _userRepository.GetDriverByIdAsync(driverId);
        await _userRepository.DeleteAsync(driverId);

        if (driver != null)
        {
            await _activityService.LogAsync(
                managerId, 
                "Видалено водія", 
                driver.FullName, 
                "Driver", 
                driverId.ToString()
            );
        }
    }

    public async Task<DriverStatsDto> GetDriverStatsAsync(int managerId)
    {
        // Перевірте, чи має менеджер дозвіл на перегляд водіїв
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

    public async Task<IEnumerable<DriverDto>> GetAllDriversAdminAsync()
    {
        var drivers = await _userRepository.GetAllDriversAsync();
        return drivers.Select(MapToDto);
    }

    public async Task<DriverDto?> GetDriverByIdAdminAsync(int driverId)
    {
        var driver = await _userRepository.GetDriverByIdAsync(driverId);
        return driver != null ? MapToDto(driver) : null;
    }

    public async Task<DriverDto> CreateDriverAdminAsync(CreateDriverDto dto)
    {
        if (await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("Користувач з таким email вже існує");
        }

        var driver = new User
        {
            Email = dto.Email,
            FullName = dto.FullName,
            Phone = dto.Phone,
            LicenseNumber = dto.LicenseNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.Driver,
            DriverStatus = DriverStatus.Offline,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var createdDriver = await _userRepository.AddAsync(driver);
        return MapToDto(createdDriver);
    }

    public async Task<DriverDto> UpdateDriverAdminAsync(int driverId, UpdateDriverDto dto)
    {
        var driver = await _userRepository.GetByIdAsync(driverId);
        if (driver == null || driver.Role != UserRole.Driver)
        {
            throw new KeyNotFoundException("Водія не знайдено");
        }

        driver.FullName = dto.FullName;
        driver.Phone = dto.Phone;
        driver.LicenseNumber = dto.LicenseNumber;
        driver.DriverStatus = dto.Status;
        driver.IsActive = dto.IsActive;

        await _userRepository.UpdateAsync(driver);
        return MapToDto(driver);
    }

    public async Task DeleteDriverAdminAsync(int driverId)
    {
        var driver = await _userRepository.GetByIdAsync(driverId);
        if (driver == null || driver.Role != UserRole.Driver)
        {
            throw new KeyNotFoundException("Водія не знайдено");
        }

        await _userRepository.DeleteAsync(driverId);
    }

    public async Task<DriverStatsDto> GetAdminDriverStatsAsync()
    {
        var drivers = await _userRepository.GetAllDriversAsync();
        var driversList = drivers.ToList();

        return new DriverStatsDto
        {
            TotalDrivers = driversList.Count,
            ActiveDrivers = driversList.Count(d => d.IsActive),
            OnTripDrivers = driversList.Count(d => d.DriverStatus == DriverStatus.OnTrip),
            OfflineDrivers = driversList.Count(d => d.DriverStatus == DriverStatus.Offline)
        };
    }

    public async Task AssignManagerAsync(int driverId, int? managerId)
    {
        var driver = await _userRepository.GetByIdAsync(driverId);
        if (driver == null || driver.Role != UserRole.Driver)
        {
            throw new KeyNotFoundException("Водія не знайдено");
        }

        if (managerId.HasValue)
        {
            var manager = await _userRepository.GetByIdAsync(managerId.Value);
            if (manager == null || manager.Role != UserRole.Manager)
            {
                throw new InvalidOperationException("Менеджера не знайдено");
            }
        }

        driver.ManagerId = managerId;
        await _userRepository.UpdateAsync(driver);

        string action = managerId.HasValue ? "Призначено менеджера" : "Відв'язано від менеджера";
        await _activityService.LogAsync(
            driverId, 
            action,
            driver.FullName,
            "Driver",
            driver.Id.ToString()
        );
    }

    public async Task AssignVehicleAsync(int driverId, int vehicleId)
    {
        var driver = await _userRepository.GetByIdAsync(driverId);
        if (driver == null || driver.Role != UserRole.Driver)
            throw new KeyNotFoundException("Водія не знайдено");

        var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);
        if (vehicle == null)
            throw new KeyNotFoundException("Транспорт не знайдено");

        if (vehicle.AssignedDrivers != null && vehicle.AssignedDrivers.Any())
        {
            var currentDriver = vehicle.AssignedDrivers.First().Driver;
            throw new InvalidOperationException($"Транспорт уже закріплений за водієм {currentDriver.FullName}");
        }

        await _vehicleRepository.AssignVehicleToDriverAsync(vehicleId, driverId, true);

        await _activityService.LogAsync(
            driverId,
            "Призначено транспорт",
            $"{vehicle.Model} ({vehicle.LicensePlate})",
            "Vehicle",
            vehicleId.ToString()
        );
    }

    public async Task UnassignVehicleAsync(int driverId, int vehicleId)
    {
        await _vehicleRepository.UnassignVehicleFromDriverAsync(vehicleId, driverId);

        var vehicle = await _vehicleRepository.GetByIdAsync(vehicleId);
        await _activityService.LogAsync(
            driverId,
            "Відкріплено транспорт",
            $"{vehicle?.Model ?? "Транспорт"}",
            "Vehicle",
            vehicleId.ToString()
        );
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
            TotalTrips = 0, // TODO: Розрахувати на основі таблиці поїздок після впровадження
            Rating = null // TODO: Розрахувати на основі рейтингів після впровадження
        };
    }
}
