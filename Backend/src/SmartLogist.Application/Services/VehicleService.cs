using SmartLogist.Application.DTOs.Vehicle;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPermissionRepository _permissionRepository;
    private readonly IActivityService _activityService;

    public VehicleService(
        IVehicleRepository vehicleRepository, 
        IUserRepository userRepository,
        IPermissionRepository permissionRepository,
        IActivityService activityService)
    {
        _vehicleRepository = vehicleRepository;
        _userRepository = userRepository;
        _permissionRepository = permissionRepository;
        _activityService = activityService;
    }

    public async Task<IEnumerable<VehicleDto>> GetAllVehiclesAsync(int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.view");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для перегляду транспорту");
        }

        var allVehicles = await _vehicleRepository.GetAllAsync();

        // Фільтр: Показати тільки якщо не призначено АБО призначено водієві цього менеджера
        var visibleVehicles = allVehicles.Where(v => 
            !v.AssignedDrivers.Any() || 
            v.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId)
        );

        return visibleVehicles.Select(MapToDto);
    }

    public async Task<VehicleDto?> GetVehicleByIdAsync(int id, int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.view");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для перегляду транспорту");
        }

        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        
        if (vehicle != null)
        {
            // Застосувати перевірку видимості
            bool isVisible = !vehicle.AssignedDrivers.Any() || 
                             vehicle.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId);
                             
            if (!isVisible)
            {
                throw new UnauthorizedAccessException("Ви не маєте доступу до цього автомобіля");
            }
        }

        return vehicle != null ? MapToDto(vehicle) : null;
    }

    public async Task<VehicleDto> CreateVehicleAsync(CreateVehicleDto dto, int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.create");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для додавання транспорту");
        }

        if (await _vehicleRepository.ExistsAsync(dto.LicensePlate))
        {
            throw new InvalidOperationException("Транспорт з таким номером вже існує");
        }

        var vehicle = new Vehicle
        {
            Model = dto.Model,
            LicensePlate = dto.LicensePlate,
            Type = dto.Type,
            FuelType = dto.FuelType,
            FuelConsumption = dto.FuelConsumption,
            Status = dto.Status
        };

        var createdVehicle = await _vehicleRepository.AddAsync(vehicle);
        
        await _activityService.LogAsync(
            managerId, 
            "Додано новий транспорт", 
            $"{dto.Model} ({dto.LicensePlate})", 
            "Vehicle", 
            createdVehicle.Id.ToString()
        );

        return MapToDto(createdVehicle);
    }

    public async Task<VehicleDto> UpdateVehicleAsync(int id, UpdateVehicleDto dto, int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.edit");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для редагування транспорту");
        }

        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
        {
            throw new KeyNotFoundException("Транспорт не знайдено");
        }

        // Перевірте право власності/видимість перед оновленням
        bool isVisible = !vehicle.AssignedDrivers.Any() || 
                         vehicle.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId);
        if (!isVisible)
        {
            throw new UnauthorizedAccessException("Ви не можете редагувати цей автомобіль");
        }

        vehicle.Model = dto.Model;
        vehicle.LicensePlate = dto.LicensePlate;
        vehicle.Type = dto.Type;
        vehicle.FuelType = dto.FuelType;
        vehicle.FuelConsumption = dto.FuelConsumption;
        vehicle.Status = dto.Status;

        await _vehicleRepository.UpdateAsync(vehicle);

        await _activityService.LogAsync(
            managerId, 
            "Оновлено дані транспорту", 
            $"{vehicle.Model} ({vehicle.LicensePlate})", 
            "Vehicle", 
            vehicle.Id.ToString()
        );

        return MapToDto(vehicle);
    }

    public async Task DeleteVehicleAsync(int id, int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.delete");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для видалення транспорту");
        }

        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle != null)
        {
            // Перевірка права власності/видимості
            bool isVisible = !vehicle.AssignedDrivers.Any() || 
                             vehicle.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId);
            if (!isVisible)
            {
                throw new UnauthorizedAccessException("Ви не можете видалити цей автомобіль");
            }
        }

        await _vehicleRepository.DeleteAsync(id);

        if (vehicle != null)
        {
            await _activityService.LogAsync(
                managerId, 
                "Видалено транспорт", 
                $"{vehicle.Model} ({vehicle.LicensePlate})", 
                "Vehicle", 
                id.ToString()
            );
        }
    }

    public async Task AssignVehicleAsync(int id, AssignVehicleDto dto, int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.edit");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для призначення транспорту");
        }

        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null) throw new KeyNotFoundException("Транспорт не знайдено");

        // Перевірити видимість
        bool isVisible = !vehicle.AssignedDrivers.Any() || 
                         vehicle.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId);
        if (!isVisible)
        {
            throw new UnauthorizedAccessException("Ви не можете призначати цей автомобіль");
        }

        // Перевірити, чи водій належить до менеджера
        var isAssigned = await _userRepository.IsDriverAssignedToManagerAsync(dto.DriverId, managerId);
        if (!isAssigned)
        {
            throw new UnauthorizedAccessException("Водій не належить цьому менеджеру");
        }

        await _vehicleRepository.AssignVehicleToDriverAsync(id, dto.DriverId, dto.IsPrimary);

        var driver = await _userRepository.GetByIdAsync(dto.DriverId);
        await _activityService.LogAsync(
            managerId, 
            "Призначено водія", 
            $"{driver?.FullName} до {vehicle.Model}", 
            "Vehicle", 
            id.ToString()
        );
    }

    public async Task UnassignVehicleAsync(int id, int driverId, int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.edit");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для зміни призначення транспорту");
        }

        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null) throw new KeyNotFoundException("Транспорт не знайдено");

        // Перевірте видимість 
        bool isVisible = vehicle.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId);
        if (!isVisible)
        {
            throw new UnauthorizedAccessException("Ви не можете відкріплювати водія від цього автомобіля");
        }

        await _vehicleRepository.UnassignVehicleFromDriverAsync(id, driverId);

        var driver = await _userRepository.GetByIdAsync(driverId);
        await _activityService.LogAsync(
            managerId, 
            "Відкріплено водія", 
            $"{driver?.FullName} від {vehicle.Model}", 
            "Vehicle", 
            id.ToString()
        );
    }

    public async Task<VehicleStatsDto> GetVehicleStatsAsync(int managerId)
    {
        // Перевірити дозвіл
        var permission = await _permissionRepository.GetByCodeAsync("vehicles.view");
        if (permission == null || !await _userRepository.HasPermissionAsync(managerId, permission.Id))
        {
            throw new UnauthorizedAccessException("Недостатньо прав для перегляду статистики");
        }

        var allVehicles = await _vehicleRepository.GetAllAsync();

        // Фільтр за власністю/доступністю менеджера
        var visibleVehicles = allVehicles.Where(v => 
            !v.AssignedDrivers.Any() || 
            v.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId)
        ).ToList();

        var now = DateTime.UtcNow;
        var startOfMonth = new DateTime(now.Year, now.Month, 1);

        return new VehicleStatsDto
        {
            TotalVehicles = visibleVehicles.Count,
            AddedThisMonth = visibleVehicles.Count(v => v.CreatedAt >= startOfMonth),
            InUseCount = visibleVehicles.Count(v => v.Status == SmartLogist.Domain.Enums.VehicleStatus.InUse),
            AvailableCount = visibleVehicles.Count(v => v.Status == SmartLogist.Domain.Enums.VehicleStatus.Available),
            MaintenanceCount = visibleVehicles.Count(v => v.Status == SmartLogist.Domain.Enums.VehicleStatus.Maintenance)
        };
    }

    public async Task<IEnumerable<VehicleDto>> GetAllVehiclesAdminAsync()
    {
        var vehicles = await _vehicleRepository.GetAllAsync();
        return vehicles.Select(MapToDto);
    }

    private VehicleDto MapToDto(Vehicle vehicle)
    {
        var primaryAssignment = vehicle.AssignedDrivers.FirstOrDefault(dv => dv.IsPrimary) 
                               ?? vehicle.AssignedDrivers.FirstOrDefault();
        
        return new VehicleDto
        {
            Id = vehicle.Id,
            Model = vehicle.Model,
            LicensePlate = vehicle.LicensePlate,
            Type = vehicle.Type,
            FuelType = vehicle.FuelType,
            FuelConsumption = vehicle.FuelConsumption,
            Status = vehicle.Status.ToString(),
            CreatedAt = vehicle.CreatedAt,
            AssignedDriverId = primaryAssignment?.DriverId,
            AssignedDriverName = primaryAssignment?.Driver?.FullName
        };
    }
}
