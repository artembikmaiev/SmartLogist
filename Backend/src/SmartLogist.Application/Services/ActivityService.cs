// Реалізація сервісу активності, що забезпечує запис та витяг даних про дії користувачів.
using SmartLogist.Application.DTOs.Activity;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public class ActivityService : IActivityService
{
    private readonly IActivityRepository _activityRepository;

    public ActivityService(IActivityRepository activityRepository)
    {
        _activityRepository = activityRepository;
    }

    public async Task LogAsync(int userId, string action, string? details = null, string? entityType = null, string? entityId = null)
    {
        var log = new ActivityLog
        {
            UserId = userId,
            Action = action,
            Details = details,
            EntityType = entityType,
            EntityId = entityId,
            CreatedAt = DateTime.UtcNow
        };

        await _activityRepository.AddAsync(log);
    }

    public async Task<IEnumerable<ActivityLogDto>> GetRecentActivitiesAsync(int userId, int count = 10)
    {
        var logs = await _activityRepository.GetRecentByUserIdAsync(userId, count);
        return logs.Select(l => new ActivityLogDto
        {
            Id = l.Id,
            Action = l.Action,
            Details = l.Details,
            EntityType = l.EntityType,
            EntityId = l.EntityId,
            CreatedAt = l.CreatedAt
        });
    }
}
