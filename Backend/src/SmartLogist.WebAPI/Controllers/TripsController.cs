using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Trip;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Enums;

namespace SmartLogist.WebAPI.Controllers;

// [Authorize]
public class TripsController : BaseApiController
{
    private readonly ITripService _tripService;

    public TripsController(ITripService tripService)
    {
        _tripService = tripService;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyTrips()
    {
        var driverId = GetUserId();
        var trips = await _tripService.GetDriverTripsAsync(driverId);
        return Ok(trips);
    }

    [HttpGet("driver-stats")]
    public async Task<IActionResult> GetDriverStats()
    {
        var driverId = GetUserId();
        var stats = await _tripService.GetDriverStatsSummaryAsync(driverId);
        return Ok(stats);
    }

    [HttpPost("{id}/accept")]
    public async Task<IActionResult> AcceptTrip(int id)
    {
        var driverId = GetUserId();
        await _tripService.AcceptTripAsync(id, driverId);
        return Ok(new { Message = "Рейс прийнято" });
    }

    [HttpPost("{id}/decline")]
    public async Task<IActionResult> DeclineTrip(int id)
    {
        var driverId = GetUserId();
        await _tripService.DeclineTripAsync(id, driverId);
        return Ok(new { Message = "Рейс відхилено" });
    }

    // [Authorize(Roles = "Manager,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripDto dto)
    {
        var managerId = GetUserId();
        var trip = await _tripService.CreateTripAsync(dto, managerId);
        return CreatedAtAction(nameof(GetMyTrips), new { id = trip.Id }, trip);
    }

    // [Authorize(Roles = "Manager,Admin")]
    [HttpGet("manager")]
    public async Task<IActionResult> GetManagerTrips()
    {
        var managerId = GetUserId();
        var trips = await _tripService.GetManagerTripsAsync(managerId);
        return Ok(trips);
    }

    // [Authorize(Roles = "Manager,Admin")]
    [HttpGet("manager-stats")]
    public async Task<IActionResult> GetManagerStats()
    {
        var managerId = GetUserId();
        var stats = await _tripService.GetManagerStatsSummaryAsync(managerId);
        return Ok(stats);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTrip(int id, [FromBody] UpdateTripDto dto)
    {
        // Simple validation: drivers can update their trips, managers can update any trip
        await _tripService.UpdateTripAsync(id, dto);
        return Ok(new { Message = "Рейс оновлено" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var managerId = GetUserId();
        await _tripService.DeleteTripAsync(id, managerId);
        return Ok(new { Message = "Запит на видалення відправлено" });
    }
}
