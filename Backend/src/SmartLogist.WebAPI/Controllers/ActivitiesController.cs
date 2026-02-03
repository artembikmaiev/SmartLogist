using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.Interfaces;
using System.Security.Claims;

namespace SmartLogist.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/activity-logs")]
public class ActivitiesController : ControllerBase
{
    private readonly IActivityService _activityService;

    public ActivitiesController(IActivityService activityService)
    {
        _activityService = activityService;
    }

    // GET: api/activities
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
        var activities = await _activityService.GetRecentActivitiesAsync(userId, 50);
        return Ok(activities);
    }

    // GET: api/activities/recent?count=10
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentActivities([FromQuery] int count = 10)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        if (!int.TryParse(userIdClaim.Value, out int userId))
        {
            return BadRequest(new { Message = "Невірний ідентифікатор користувача" });
        }

        var activities = await _activityService.GetRecentActivitiesAsync(userId, count);
        return Ok(activities);
    }
}
