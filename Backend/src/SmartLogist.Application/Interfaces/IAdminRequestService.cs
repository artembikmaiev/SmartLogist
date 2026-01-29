using SmartLogist.Application.DTOs.AdminRequest;

namespace SmartLogist.Application.Interfaces;

public interface IAdminRequestService
{
    Task<IEnumerable<AdminRequestDto>> GetAllRequestsAsync();
    Task<IEnumerable<AdminRequestDto>> GetPendingRequestsAsync();
    Task<IEnumerable<AdminRequestDto>> GetRequesterRequestsAsync(int requesterId);
    Task<AdminRequestDto> CreateRequestAsync(CreateRequestDto dto, int requesterId);
    Task ProcessRequestAsync(int id, ProcessRequestDto dto, int adminId);
    Task ClearProcessedRequestsAsync();
}
