using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public abstract class BaseService
{
    protected readonly IUserRepository _userRepository;
    protected readonly IPermissionRepository _permissionRepository;

    protected BaseService(IUserRepository userRepository, IPermissionRepository permissionRepository)
    {
        _userRepository = userRepository;
        _permissionRepository = permissionRepository;
    }

    protected async Task EnsurePermissionAsync(int userId, string permissionCode, string errorMessage = "Access denied")
    {
        var permission = await _permissionRepository.GetByCodeAsync(permissionCode);
        if (permission == null || !await _userRepository.HasPermissionAsync(userId, permission.Id))
        {
            throw new UnauthorizedAccessException(errorMessage);
        }
    }

    protected async Task EnsureDriverAssignedToManagerAsync(int driverId, int managerId, string errorMessage = "Driver not assigned to this manager")
    {
        var isAssigned = await _userRepository.IsDriverAssignedToManagerAsync(driverId, managerId);
        if (!isAssigned)
        {
            throw new UnauthorizedAccessException(errorMessage);
        }
    }
}
