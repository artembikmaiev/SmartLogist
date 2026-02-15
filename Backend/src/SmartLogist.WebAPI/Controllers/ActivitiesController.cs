// Цей контролер надає методи для отримання логів активності користувачів у системі.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.WebAPI.Controllers;

// [Authorize]
[Route("api/activity-logs")]
public class ActivitiesController : BaseApiController
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var activities = await _activityService.GetRecentActivitiesAsync(userId, 50);
        return Ok(activities);
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentActivities([FromQuery] int count = 10)
    {
        var userId = GetUserId();
        var activities = await _activityService.GetRecentActivitiesAsync(userId, count);
        return Ok(activities);
    }
}
