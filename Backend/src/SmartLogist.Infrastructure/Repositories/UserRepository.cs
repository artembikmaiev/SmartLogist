using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Manager)
            .Include(u => u.ManagedDrivers)
            .Include(u => u.AssignedVehicles)
                .ThenInclude(dv => dv.Vehicle)
            .Include(u => u.ManagerPermissions)
                .ThenInclude(mp => mp.Permission)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.AssignedVehicles)
                .ThenInclude(dv => dv.Vehicle)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IEnumerable<User>> GetAllManagersAsync()
    {
        return await _context.Users
            .Where(u => u.Role == UserRole.Manager)
            .Include(u => u.ManagedDrivers)
            .Include(u => u.ManagerPermissions)
                .ThenInclude(mp => mp.Permission)
            .OrderBy(u => u.FullName)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetAllAdminsAsync()
    {
        return await _context.Users
            .Where(u => u.Role == UserRole.Admin)
            .OrderBy(u => u.FullName)
            .ToListAsync();
    }

    public async Task<User> AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    public async Task<bool> PhoneExistsAsync(string phone)
    {
        if (string.IsNullOrEmpty(phone))
            return false;
            
        return await _context.Users.AnyAsync(u => u.Phone == phone);
    }

    public async Task<int> GetActiveDriversCountAsync(int managerId)
    {
        return await _context.Users
            .Where(u => u.ManagerId == managerId && u.IsActive)
            .CountAsync();
    }

    public async Task<IEnumerable<ManagerPermission>> GetManagerPermissionsAsync(int managerId)
    {
        return await _context.ManagerPermissions
            .Include(mp => mp.Permission)
            .Where(mp => mp.ManagerId == managerId)
            .OrderBy(mp => mp.Permission.Category)
            .ThenBy(mp => mp.Permission.Name)
            .ToListAsync();
    }

    public async Task GrantPermissionAsync(int managerId, int permissionId, int? grantedBy = null)
    {
        var managerPermission = new ManagerPermission
        {
            ManagerId = managerId,
            PermissionId = permissionId,
            GrantedBy = grantedBy,
            GrantedAt = DateTime.UtcNow
        };

        await _context.ManagerPermissions.AddAsync(managerPermission);
        await _context.SaveChangesAsync();
    }

    public async Task RevokePermissionAsync(int managerId, int permissionId)
    {
        var managerPermission = await _context.ManagerPermissions
            .FirstOrDefaultAsync(mp => mp.ManagerId == managerId && mp.PermissionId == permissionId);

        if (managerPermission != null)
        {
            _context.ManagerPermissions.Remove(managerPermission);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> HasPermissionAsync(int managerId, int permissionId)
    {
        return await _context.ManagerPermissions
            .AnyAsync(mp => mp.ManagerId == managerId && mp.PermissionId == permissionId);
    }

    // Методи водіїв
    public async Task<IEnumerable<User>> GetDriversByManagerIdAsync(int managerId)
    {
        return await _context.Users
            .Include(u => u.AssignedVehicles)
                .ThenInclude(dv => dv.Vehicle)
            .Where(u => u.Role == UserRole.Driver && u.ManagerId == managerId)
            .OrderBy(u => u.FullName)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetAllDriversAsync()
    {
        return await _context.Users
            .Include(u => u.Manager)
            .Include(u => u.AssignedVehicles)
                .ThenInclude(dv => dv.Vehicle)
            .Where(u => u.Role == UserRole.Driver)
            .OrderBy(u => u.FullName)
            .ToListAsync();
    }

    public async Task<User?> GetDriverByIdAsync(int driverId)
    {
        return await _context.Users
            .Include(u => u.Manager)
            .Include(u => u.AssignedVehicles)
                .ThenInclude(dv => dv.Vehicle)
            .FirstOrDefaultAsync(u => u.Id == driverId && u.Role == UserRole.Driver);
    }

    public async Task<bool> IsDriverAssignedToManagerAsync(int driverId, int managerId)
    {
        return await _context.Users
            .AnyAsync(u => u.Id == driverId && u.Role == UserRole.Driver && u.ManagerId == managerId);
    }

    public async Task<int> GetDriversCountByManagerIdAsync(int managerId)
    {
        return await _context.Users
            .CountAsync(u => u.Role == UserRole.Driver && u.ManagerId == managerId);
    }
}
