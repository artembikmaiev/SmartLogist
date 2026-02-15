// Цей репозиторій забезпечує функціонал для роботи зі сповіщеннями користувачів у системі.
using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.Infrastructure.Repositories;

public class NotificationRepository : INotificationRepository
{
    private readonly ApplicationDbContext _context;

    public NotificationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Notification?> GetByIdAsync(int id)
    {
        return await _context.Set<Notification>().FindAsync(id);
    }

    public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId)
    {
        return await _context.Set<Notification>()
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _context.Set<Notification>()
            .CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    public async Task AddAsync(Notification notification)
    {
        await _context.Set<Notification>().AddAsync(notification);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Notification notification)
    {
        _context.Set<Notification>().Update(notification);
        await _context.SaveChangesAsync();
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        var unread = await _context.Set<Notification>()
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();
            
        foreach (var n in unread)
        {
            n.IsRead = true;
        }
        
        await _context.SaveChangesAsync();
    }

    public async Task ClearAllAsync(int userId)
    {
        var notifications = await _context.Set<Notification>()
            .Where(n => n.UserId == userId)
            .ToListAsync();
            
        _context.Set<Notification>().RemoveRange(notifications);
        await _context.SaveChangesAsync();
    }
}
