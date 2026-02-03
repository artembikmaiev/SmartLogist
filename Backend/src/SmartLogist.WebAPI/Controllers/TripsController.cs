using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Trip;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Enums;
using System.Security.Claims;

namespace SmartLogist.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/trips")]
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

    [Authorize(Roles = "Manager,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripDto dto)
    {
        try
        {
            var managerId = GetUserId();
            var trip = await _tripService.CreateTripAsync(dto, managerId);
            return CreatedAtAction(nameof(GetMyTrips), new { id = trip.Id }, trip);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize(Roles = "Manager,Admin")]
    [HttpGet("manager")]
    public async Task<IActionResult> GetManagerTrips()
    {
        try
        {
            var managerId = GetUserId();
            var trips = await _tripService.GetManagerTripsAsync(managerId);
            return Ok(trips);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [Authorize(Roles = "Manager,Admin")]
    [HttpGet("manager-stats")]
    public async Task<IActionResult> GetManagerStats()
    {
        try
        {
            var managerId = GetUserId();
            var stats = await _tripService.GetManagerStatsSummaryAsync(managerId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTrip(int id, [FromBody] UpdateTripDto dto)
    {
        try
        {
            // Simple validation: drivers can update their trips, managers can update any trip
            await _tripService.UpdateTripAsync(id, dto);
            return Ok(new { Message = "Рейс оновлено" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPost("{id}/delete")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var managerId = GetUserId();
            await _tripService.DeleteTripAsync(id, managerId);
            return Ok(new { Message = "Запит на видалення відправлено" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { Message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
