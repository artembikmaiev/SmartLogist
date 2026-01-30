using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Enums;
using System.Security.Claims;

namespace SmartLogist.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TripsController : ControllerBase
{
    private readonly ITripService _tripService;

    public TripsController(ITripService tripService)
    {
        _tripService = tripService;
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

    [HttpGet("my")]
    public async Task<IActionResult> GetMyTrips()
    {
        try
        {
            var driverId = GetUserId();
            var trips = await _tripService.GetDriverTripsAsync(driverId);
            return Ok(trips);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("driver-stats")]
    public async Task<IActionResult> GetDriverStats()
    {
        try
        {
            var driverId = GetUserId();
            var stats = await _tripService.GetDriverStatsSummaryAsync(driverId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("{id}/accept")]
    public async Task<IActionResult> AcceptTrip(int id)
    {
        try
        {
            var driverId = GetUserId();
            await _tripService.AcceptTripAsync(id, driverId);
            return Ok(new { Message = "Рейс прийнято" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("{id}/decline")]
    public async Task<IActionResult> DeclineTrip(int id)
    {
        try
        {
            var driverId = GetUserId();
            await _tripService.DeclineTripAsync(id, driverId);
            return Ok(new { Message = "Рейс відхилено" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
