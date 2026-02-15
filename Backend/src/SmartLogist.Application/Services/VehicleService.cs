// Цей сервіс реалізує бізнес-логіку управління транспортними засобами, включаючи створення, оновлення та перевірку прав доступу.
using SmartLogist.Application.DTOs.Vehicle;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Domain.Enums;

namespace SmartLogist.Application.Services;

public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _vehicleRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPermissionRepository _permissionRepository;
    private readonly IActivityService _activityService;
    private readonly IAdminRequestService _adminRequestService;

    public VehicleService(
        IVehicleRepository vehicleRepository, 
        IUserRepository userRepository,
        IPermissionRepository permissionRepository,
        IActivityService activityService,
        IAdminRequestService adminRequestService)
    {
        _vehicleRepository = vehicleRepository;
        _userRepository = userRepository;
        _permissionRepository = permissionRepository;
        _activityService = activityService;
        _adminRequestService = adminRequestService;
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
        var pendingRequests = (await _adminRequestService.GetPendingRequestsAsync()).ToList();

        var pendingDeletionIds = pendingRequests
            .Where(r => r.Type == RequestType.VehicleDeletion && r.TargetId.HasValue)
            .Select(r => r.TargetId!.Value)
            .ToList();

        var pendingUpdateIds = pendingRequests
            .Where(r => r.Type == RequestType.VehicleUpdate && r.TargetId.HasValue)
            .Select(r => r.TargetId!.Value)
            .ToList();

        // Фільтр: Показати тільки якщо не призначено АБО призначено водієві цього менеджера
        var visibleVehicles = allVehicles.Where(v => 
            !v.AssignedDrivers.Any() || 
            v.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId)
        );

        return visibleVehicles.Select(v => MapToDto(v, pendingDeletionIds, pendingUpdateIds));
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

        if (vehicle == null) return null;

        var pendingRequests = (await _adminRequestService.GetPendingRequestsAsync()).ToList();

        var pendingDeletionIds = pendingRequests
            .Where(r => r.Type == RequestType.VehicleDeletion && r.TargetId.HasValue)
            .Select(r => r.TargetId!.Value)
            .ToList();

        var pendingUpdateIds = pendingRequests
            .Where(r => r.Type == RequestType.VehicleUpdate && r.TargetId.HasValue)
            .Select(r => r.TargetId!.Value)
            .ToList();

        return MapToDto(vehicle, pendingDeletionIds, pendingUpdateIds);
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

        // Створити запит замість транспорту
        await _adminRequestService.CreateRequestAsync(new SmartLogist.Application.DTOs.AdminRequest.CreateRequestDto
        {
            Type = RequestType.VehicleCreation,
            TargetId = null,
            TargetName = dto.Model,
            Comment = System.Text.Json.JsonSerializer.Serialize(dto)
        }, managerId);

        await _activityService.LogAsync(
            managerId, 
            "Створено запит на додавання транспорту", 
            $"{dto.Model} ({dto.LicensePlate})", 
            "Vehicle", 
            "0"
        );

        return new VehicleDto { Model = dto.Model, LicensePlate = dto.LicensePlate, Status = "Pending" };
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

        // Оновити транспорт безпосередньо
        vehicle.Model = dto.Model;
        vehicle.LicensePlate = dto.LicensePlate;
        vehicle.Type = dto.Type;
        vehicle.FuelType = dto.FuelType;
        vehicle.FuelConsumption = dto.FuelConsumption;
        vehicle.Height = dto.Height;
        vehicle.Width = dto.Width;
        vehicle.Length = dto.Length;
        vehicle.Weight = dto.Weight;
        vehicle.IsHazardous = dto.IsHazardous;
        vehicle.Status = dto.Status;
        vehicle.TotalMileage = dto.TotalMileage;
        vehicle.MileageAtLastMaintenance = dto.MileageAtLastMaintenance;

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

        // Створити запит замість видалення
        await _adminRequestService.CreateRequestAsync(new SmartLogist.Application.DTOs.AdminRequest.CreateRequestDto
        {
            Type = RequestType.VehicleDeletion,
            TargetId = id,
            TargetName = vehicle?.Model ?? "Транспорт",
            Comment = "Запит на видалення транспорту від менеджера"
        }, managerId);

        if (vehicle != null)
        {
            await _activityService.LogAsync(
                managerId, 
                "Створено запит на видалення транспорту", 
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
        var pendingRequests = (await _adminRequestService.GetPendingRequestsAsync()).ToList();

        var pendingDeletionIds = pendingRequests
            .Where(r => r.Type == RequestType.VehicleDeletion && r.TargetId.HasValue)
            .Select(r => r.TargetId!.Value)
            .ToList();

        var pendingUpdateIds = pendingRequests
            .Where(r => r.Type == RequestType.VehicleUpdate && r.TargetId.HasValue)
            .Select(r => r.TargetId!.Value)
            .ToList();

        return vehicles.Select(v => MapToDto(v, pendingDeletionIds, pendingUpdateIds));
    }

    public async Task<VehicleDto> CreateVehicleAdminAsync(CreateVehicleDto dto)
    {
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
            Height = dto.Height,
            Width = dto.Width,
            Length = dto.Length,
            Weight = dto.Weight,
            IsHazardous = dto.IsHazardous,
            Status = dto.Status,
            TotalMileage = dto.TotalMileage,
            MileageAtLastMaintenance = dto.MileageAtLastMaintenance
        };

        var createdVehicle = await _vehicleRepository.AddAsync(vehicle);
        return MapToDto(createdVehicle);
    }

    public async Task<VehicleDto> UpdateVehicleAdminAsync(int id, UpdateVehicleDto dto)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null) throw new KeyNotFoundException("Транспорт не знайдено");

        vehicle.Model = dto.Model;
        vehicle.LicensePlate = dto.LicensePlate;
        vehicle.Type = dto.Type;
        vehicle.FuelType = dto.FuelType;
        vehicle.FuelConsumption = dto.FuelConsumption;
        vehicle.Height = dto.Height;
        vehicle.Width = dto.Width;
        vehicle.Length = dto.Length;
        vehicle.Weight = dto.Weight;
        vehicle.IsHazardous = dto.IsHazardous;
        vehicle.Status = dto.Status;
        vehicle.TotalMileage = dto.TotalMileage;
        vehicle.MileageAtLastMaintenance = dto.MileageAtLastMaintenance;

        await _vehicleRepository.UpdateAsync(vehicle);
        return MapToDto(vehicle);
    }

    public async Task DeleteVehicleAdminAsync(int id)
    {
        await _vehicleRepository.DeleteAsync(id);
    }

    public async Task PerformMaintenanceAsync(int id, int managerId)
    {
        var vehicle = await _vehicleRepository.GetByIdAsync(id);
        if (vehicle == null)
            throw new KeyNotFoundException("Автомобіль не знайдено");

        // Перевірка видимості/прав (спрощено)
        bool canManage = !vehicle.AssignedDrivers.Any() || 
                        vehicle.AssignedDrivers.Any(ad => ad.Driver.ManagerId == managerId);
                        
        if (!canManage)
        {
            throw new UnauthorizedAccessException("Ви не маєте доступу до цього автомобіля");
        }

        vehicle.MileageAtLastMaintenance = vehicle.TotalMileage;
        await _vehicleRepository.UpdateAsync(vehicle);

        await _activityService.LogAsync(
            managerId, 
            "Проведено ТО", 
            $"{vehicle.Model} ({vehicle.LicensePlate})", 
            "Vehicle", 
            id.ToString()
        );
    }

    private VehicleDto MapToDto(Vehicle vehicle, IEnumerable<int>? pendingDeletionIds = null, IEnumerable<int>? pendingUpdateIds = null)
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
            Height = vehicle.Height,
            Width = vehicle.Width,
            Length = vehicle.Length,
            Weight = vehicle.Weight,
            IsHazardous = vehicle.IsHazardous,
            Status = vehicle.Status.ToString(),
            CreatedAt = vehicle.CreatedAt,
            AssignedDriverId = primaryAssignment?.DriverId,
            AssignedDriverName = primaryAssignment?.Driver?.FullName,
            HasPendingDeletion = pendingDeletionIds?.Contains(vehicle.Id) ?? false,
            HasPendingUpdate = pendingUpdateIds?.Contains(vehicle.Id) ?? false,
            TotalMileage = vehicle.TotalMileage,
            MileageAtLastMaintenance = vehicle.MileageAtLastMaintenance,
            KmUntilMaintenance = Math.Max(0, 10000 - (vehicle.TotalMileage - vehicle.MileageAtLastMaintenance))
        };
    }
}
