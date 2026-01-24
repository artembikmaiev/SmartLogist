using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllManagersAsync();
    Task<User> AddAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(int id);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> PhoneExistsAsync(string phone);
    Task<int> GetActiveDriversCountAsync(int managerId);
    Task<IEnumerable<ManagerPermission>> GetManagerPermissionsAsync(int managerId);
    Task GrantPermissionAsync(int managerId, int permissionId, int? grantedBy = null);
    Task RevokePermissionAsync(int managerId, int permissionId);
    Task<bool> HasPermissionAsync(int managerId, int permissionId);

    // Методи управління водіями
    Task<IEnumerable<User>> GetDriversByManagerIdAsync(int managerId);
    Task<User?> GetDriverByIdAsync(int driverId);
    Task<bool> IsDriverAssignedToManagerAsync(int driverId, int managerId);
    Task<int> GetDriversCountByManagerIdAsync(int managerId);
}
