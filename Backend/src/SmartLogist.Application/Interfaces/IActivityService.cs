using SmartLogist.Application.DTOs.Activity;

namespace SmartLogist.Application.Interfaces;

public interface IActivityService
{
    Task LogAsync(int userId, string action, string? details = null, string? entityType = null, string? entityId = null);
    Task<IEnumerable<ActivityLogDto>> GetRecentActivitiesAsync(int userId, int count = 10);
}
