using SmartLogist.Application.DTOs.Manager;
using SmartLogist.Application.DTOs.Permission;

namespace SmartLogist.Application.Interfaces;

public interface IManagerService
{
    Task<IEnumerable<ManagerDto>> GetAllManagersAsync();
    Task<ManagerDto?> GetManagerByIdAsync(int id);
    Task<ManagerDto> CreateManagerAsync(CreateManagerDto dto);
    Task<ManagerDto?> UpdateManagerAsync(int id, UpdateManagerDto dto);
    Task<bool> DeleteManagerAsync(int id);

    // Управління дозволами
    Task<IEnumerable<PermissionDto>> GetAllPermissionsAsync();
    Task<IEnumerable<PermissionDto>> GetManagerPermissionsAsync(int managerId);
    Task GrantPermissionAsync(int managerId, int permissionId);
    Task RevokePermissionAsync(int managerId, int permissionId);
}
