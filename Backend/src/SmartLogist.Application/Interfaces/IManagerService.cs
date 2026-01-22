using SmartLogist.Application.DTOs.Manager;

namespace SmartLogist.Application.Interfaces;

public interface IManagerService
{
    Task<IEnumerable<ManagerDto>> GetAllManagersAsync();
    Task<ManagerDto?> GetManagerByIdAsync(int id);
    Task<ManagerDto> CreateManagerAsync(CreateManagerDto dto);
    Task<ManagerDto?> UpdateManagerAsync(int id, UpdateManagerDto dto);
    Task<bool> DeleteManagerAsync(int id);
}
