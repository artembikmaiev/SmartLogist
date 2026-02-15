// Інтерфейс репозиторію для роботи зі сповіщеннями користувачів.
using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(int id);
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId);
    Task<int> GetUnreadCountAsync(int userId);
    Task AddAsync(Notification notification);
    Task UpdateAsync(Notification notification);
    Task MarkAllAsReadAsync(int userId);
    Task ClearAllAsync(int userId);
}
