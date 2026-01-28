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
        string finalComment = dto.Comment;

        // For update requests, capture original state for "was -> becomes" history
        try 
        {
            if (dto.TargetId.HasValue && (dto.Type == RequestType.DriverUpdate || dto.Type == RequestType.VehicleUpdate))
            {
                object? originalData = null;
                if (dto.Type == RequestType.DriverUpdate)
                {
                    var driver = await _userRepository.GetByIdAsync(dto.TargetId.Value);
                    if (driver != null)
                    {
                        originalData = new {
                            driver.FullName,
                            driver.Phone,
                            driver.LicenseNumber,
                            Status = driver.DriverStatus,
                            driver.IsActive
                        };
                    }
                }
                else if (dto.Type == RequestType.VehicleUpdate)
                {
                    var vehicle = await _vehicleRepository.GetByIdAsync(dto.TargetId.Value);
                    if (vehicle != null)
                    {
                        originalData = new {
                            vehicle.Model,
                            vehicle.LicensePlate,
                            vehicle.Type,
                            vehicle.FuelType,
                            vehicle.FuelConsumption,
                            vehicle.Status
                        };
                    }
                }

                if (originalData != null)
                {
                    var commentObj = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.Nodes.JsonObject>(dto.Comment);
                    if (commentObj != null)
                    {
                        commentObj["_original"] = System.Text.Json.JsonSerializer.SerializeToNode(originalData);
                        finalComment = commentObj.ToJsonString();
                    }
                }
            }
        }
        catch {  }

        var request = new AdminRequest
        {
            Type = dto.Type,
            TargetId = dto.TargetId,
            TargetName = dto.TargetName,
            Comment = finalComment,
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

        if (dto.Approved && request.TargetId.HasValue)
        {
            switch (request.Type)
            {
                case RequestType.DriverDeletion:
                    await _userRepository.DeleteAsync(request.TargetId.Value);
                    break;

                case RequestType.DriverUpdate:
                    var driver = await _userRepository.GetByIdAsync(request.TargetId.Value);
                    if (driver != null && !string.IsNullOrEmpty(request.Comment))
                    {
                        var updateDto = System.Text.Json.JsonSerializer.Deserialize<SmartLogist.Application.DTOs.Driver.UpdateDriverDto>(request.Comment);
                        if (updateDto != null)
                        {
                            driver.FullName = updateDto.FullName;
                            driver.Phone = updateDto.Phone;
                            driver.LicenseNumber = updateDto.LicenseNumber;
                            driver.DriverStatus = updateDto.Status;
                            driver.IsActive = updateDto.IsActive;
                            await _userRepository.UpdateAsync(driver);
                        }
                    }
                    break;

                case RequestType.VehicleDeletion:
                    await _vehicleRepository.DeleteAsync(request.TargetId.Value);
                    break;

                case RequestType.VehicleUpdate:
                    var vehicle = await _vehicleRepository.GetByIdAsync(request.TargetId.Value);
                    if (vehicle != null && !string.IsNullOrEmpty(request.Comment))
                    {
                        var updateDto = System.Text.Json.JsonSerializer.Deserialize<SmartLogist.Application.DTOs.Vehicle.UpdateVehicleDto>(request.Comment);
                        if (updateDto != null)
                        {
                            vehicle.Model = updateDto.Model;
                            vehicle.LicensePlate = updateDto.LicensePlate;
                            vehicle.Type = updateDto.Type;
                            vehicle.FuelType = updateDto.FuelType;
                            vehicle.FuelConsumption = updateDto.FuelConsumption;
                            vehicle.Status = updateDto.Status;
                            await _vehicleRepository.UpdateAsync(vehicle);
                        }
                    }
                    break;
            }
            
            await _activityService.LogAsync(
                adminId,
                $"Запит схвалено: {request.Type}",
                request.TargetName,
                request.Type.ToString().Contains("Driver") ? "User" : "Vehicle",
                request.TargetId.Value.ToString()
            );

            await _notificationService.CreateNotificationAsync(
                request.RequesterId,
                "Запит схвалено",
                $"Ваш запит на {request.Type} щодо {request.TargetName} було схвалено.",
                "Success",
                "AdminRequest",
                request.Id.ToString()
            );
        }
        else
        {
             await _activityService.LogAsync(
                adminId,
                dto.Approved ? "Запит схвалено" : "Запит відхилено",
                $"{request.Type}: {request.TargetName}",
                "AdminRequest",
                request.Id.ToString()
            );

            await _notificationService.CreateNotificationAsync(
                request.RequesterId,
                dto.Approved ? "Запит схвалено" : "Запит відхилено",
                $"Ваш запит ({request.Type}) щодо {request.TargetName} було {(dto.Approved ? "схвалено" : "відхилено")}. Коментар адміна: {dto.Response}",
                dto.Approved ? "Success" : "Error",
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
