using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.Interfaces;
using System.Security.Claims;

namespace SmartLogist.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("Невалідний токен");
        }
        return userId;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var managerId = GetUserId();
        var summary = await _analyticsService.GetSummaryAsync(managerId);
        return Ok(summary);
    }

    [HttpGet("trends")]
    public async Task<IActionResult> GetTrends([FromQuery] int months = 6)
    {
        var managerId = GetUserId();
        var trends = await _analyticsService.GetMonthlyTrendsAsync(managerId, months);
        return Ok(trends);
    }

    [HttpGet("drivers")]
    public async Task<IActionResult> GetDriverRankings()
    {
        var managerId = GetUserId();
        var rankings = await _analyticsService.GetDriverRankingsAsync(managerId);
        return Ok(rankings);
    }

    [HttpGet("cargo")]
    public async Task<IActionResult> GetCargoAnalysis()
    {
        var managerId = GetUserId();
        var analysis = await _analyticsService.GetCargoAnalysisAsync(managerId);
        return Ok(analysis);
    }
}
