using SmartLogist.Application.DTOs.AdminRequest;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;
using SmartLogist.Domain.Interfaces;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace SmartLogist.Application.Services;

public class AdminRequestService : IAdminRequestService
{
    private readonly IAdminRequestRepository _requestRepository;
    private readonly IUserRepository _userRepository;
    private readonly IActivityService _activityService;
    private readonly INotificationService _notificationService;
    private readonly IVehicleRepository _vehicleRepository;

    public AdminRequestService(
        IAdminRequestRepository requestRepository, 
        IUserRepository userRepository,
        IActivityService activityService,
        INotificationService notificationService,
        IVehicleRepository vehicleRepository)
    {
        _requestRepository = requestRepository;
        _userRepository = userRepository;
        _activityService = activityService;
        _notificationService = notificationService;
        _vehicleRepository = vehicleRepository;
    }

    public async Task<IEnumerable<AdminRequestDto>> GetAllRequestsAsync()
    {
        var requests = await _requestRepository.GetAllAsync();
        return requests.Select(MapToDto);
    }

    public async Task<IEnumerable<AdminRequestDto>> GetPendingRequestsAsync()
    {
        var requests = await _requestRepository.GetPendingAsync();
        return requests.Select(MapToDto);
    }

    public async Task<AdminRequestDto> CreateRequestAsync(CreateRequestDto dto, int requesterId)
    {
        var request = new AdminRequest
        {
            Type = dto.Type,
            TargetId = dto.TargetId,
            TargetName = dto.TargetName,
            Comment = dto.Comment,
            RequesterId = requesterId,
            CreatedAt = DateTime.UtcNow,
            Status = RequestStatus.Pending
        };

        await _requestRepository.AddAsync(request);
        
        await _activityService.LogAsync(
            requesterId,
            "Створено запит до адміністратора",
            $"{dto.Type}: {dto.TargetName}",
            "AdminRequest",
            request.Id.ToString()
        );

        return MapToDto(request);
    }

    public async Task ProcessRequestAsync(int id, ProcessRequestDto dto, int adminId)
    {
        var request = await _requestRepository.GetByIdAsync(id);
        if (request == null) throw new KeyNotFoundException("Запит не знайдено");
        
        if (request.Status != RequestStatus.Pending)
            throw new InvalidOperationException("Запит уже оброблений");

        request.Status = dto.Approved ? RequestStatus.Approved : RequestStatus.Rejected;
        request.AdminResponse = dto.Response;
        request.ProcessedAt = DateTime.UtcNow;
        request.ProcessedById = adminId;

        if (dto.Approved)
        {
            switch (request.Type)
            {
                case RequestType.DriverDeletion:
                    if (request.TargetId.HasValue)
                        await _userRepository.DeleteAsync(request.TargetId.Value);
                    break;

                case RequestType.VehicleDeletion:
                    if (request.TargetId.HasValue)
                        await _vehicleRepository.DeleteAsync(request.TargetId.Value);
                    break;

                case RequestType.DriverCreation:
                    if (!string.IsNullOrEmpty(request.Comment))
                    {
                        var createDto = System.Text.Json.JsonSerializer.Deserialize<SmartLogist.Application.DTOs.Driver.CreateDriverDto>(request.Comment);
                        if (createDto != null)
                        {
                            var newDriver = new User
                            {
                                Email = createDto.Email,
                                FullName = createDto.FullName,
                                Phone = createDto.Phone,
                                LicenseNumber = createDto.LicenseNumber,
                                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password),
                                Role = UserRole.Driver,
                                ManagerId = request.RequesterId,
                                DriverStatus = DriverStatus.Offline,
                                IsActive = true,
                                CreatedAt = DateTime.UtcNow
                            };
                            await _userRepository.AddAsync(newDriver);
                        }
                    }
                    break;

                case RequestType.VehicleCreation:
                    if (!string.IsNullOrEmpty(request.Comment))
                    {
                        var createDto = System.Text.Json.JsonSerializer.Deserialize<SmartLogist.Application.DTOs.Vehicle.CreateVehicleDto>(request.Comment);
                        if (createDto != null)
                        {
                            var newVehicle = new Vehicle
                            {
                                Model = createDto.Model,
                                LicensePlate = createDto.LicensePlate,
                                Type = createDto.Type,
                                FuelType = createDto.FuelType,
                                FuelConsumption = createDto.FuelConsumption,
                                Status = createDto.Status,
                                CreatedAt = DateTime.UtcNow
                            };
                            await _vehicleRepository.AddAsync(newVehicle);
                        }
                    }
                    break;
            }
            
            await _activityService.LogAsync(
                adminId,
                $"Запит схвалено: {request.Type}",
                request.TargetName,
                request.Type.ToString().Contains("Driver") ? "User" : "Vehicle",
                request.TargetId?.ToString() ?? "0"
            );

            await _notificationService.CreateNotificationAsync(
                request.RequesterId,
                "Запит схвалено",
                $"Ваш запит на {request.Type} щодо {request.TargetName} було схвалено. Коментар адміна: {dto.Response}",
                "Success",
                "AdminRequest",
                request.Id.ToString()
            );
        }
        else
        {
             await _activityService.LogAsync(
                adminId,
                "Запит відхилено",
                $"{request.Type}: {request.TargetName}",
                "AdminRequest",
                request.Id.ToString()
            );

            await _notificationService.CreateNotificationAsync(
                request.RequesterId,
                "Запит відхилено",
                $"Ваш запит ({request.Type}) щодо {request.TargetName} було відхилено. Коментар адміна: {dto.Response}",
                "Error",
                "AdminRequest",
                request.Id.ToString()
            );
        }

        await _requestRepository.UpdateAsync(request);
    }

    public async Task ClearProcessedRequestsAsync()
    {
        await _requestRepository.ClearProcessedAsync();
    }

    public async Task<IEnumerable<AdminRequestDto>> GetRequesterRequestsAsync(int requesterId)
    {
        var requests = await _requestRepository.GetByRequesterIdAsync(requesterId);
        return requests.OrderByDescending(r => r.CreatedAt).Select(MapToDto);
    }

    private AdminRequestDto MapToDto(AdminRequest request)
    {
        return new AdminRequestDto
        {
            Id = request.Id,
            Type = request.Type,
            Status = request.Status,
            RequesterId = request.RequesterId,
            RequesterName = request.Requester?.FullName ?? "Невідомо",
            TargetId = request.TargetId,
            TargetName = request.TargetName,
            Comment = request.Comment,
            AdminResponse = request.AdminResponse,
            CreatedAt = request.CreatedAt,
            ProcessedAt = request.ProcessedAt,
            ProcessedBy = request.ProcessedBy?.FullName
        };
    }
}
