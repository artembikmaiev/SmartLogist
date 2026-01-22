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
            .Include(u => u.ManagerPermissions)
                .ThenInclude(mp => mp.Permission)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
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
}
