// Інтерфейс репозиторію для обробки запитів на зміну даних, що потребують підтвердження адміністратором.
using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface IAdminRequestRepository
{
    Task<AdminRequest?> GetByIdAsync(int id);
    Task<IEnumerable<AdminRequest>> GetAllAsync();
    Task<IEnumerable<AdminRequest>> GetPendingAsync();
    Task<IEnumerable<AdminRequest>> GetByRequesterIdAsync(int requesterId);
    Task AddAsync(AdminRequest request);
    Task UpdateAsync(AdminRequest request);
    Task ClearProcessedAsync();
}
