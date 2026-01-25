using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface IActivityRepository
{
    Task AddAsync(ActivityLog log);
    Task<IEnumerable<ActivityLog>> GetRecentByUserIdAsync(int userId, int count);
}
