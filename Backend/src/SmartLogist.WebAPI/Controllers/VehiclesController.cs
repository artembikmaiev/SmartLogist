// Контролер для управління парком транспортних засобів, включаючи їх реєстрацію, моніторинг та призначення водіїв.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Vehicle;
using SmartLogist.Application.Interfaces;
using System.Security.Claims;

namespace SmartLogist.WebAPI.Controllers;

// [Authorize]
[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
    {
        _vehicleService = vehicleService;
    }

    private int GetCurrentManagerId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("Невалідний токен");
        }
        return userId;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var managerId = GetCurrentManagerId();
            var vehicles = await _vehicleService.GetAllVehiclesAsync(managerId);
            return Ok(vehicles);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        try
        {
            var managerId = GetCurrentManagerId();
            var stats = await _vehicleService.GetVehicleStatsAsync(managerId);
            return Ok(stats);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var managerId = GetCurrentManagerId();
            var vehicle = await _vehicleService.GetVehicleByIdAsync(id, managerId);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVehicleDto dto)
    {
        try
        {
            var managerId = GetCurrentManagerId();
            var vehicle = await _vehicleService.CreateVehicleAsync(dto, managerId);
            return CreatedAtAction(nameof(GetById), new { id = vehicle.Id }, vehicle);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            var message = ex.InnerException?.Message ?? ex.Message;
            return BadRequest(new { message = $"Помилка збереження: {message}" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVehicleDto dto)
    {
        try
        {
            var managerId = GetCurrentManagerId();
            var vehicle = await _vehicleService.UpdateVehicleAsync(id, dto, managerId);
            return Ok(vehicle);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var managerId = GetCurrentManagerId();
            await _vehicleService.DeleteVehicleAsync(id, managerId);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/assign")]
    public async Task<IActionResult> Assign(int id, [FromBody] AssignVehicleDto dto)
    {
        try
        {
            var managerId = GetCurrentManagerId();
            await _vehicleService.AssignVehicleAsync(id, dto, managerId);
            return Ok(new { message = "Транспорт призначено успішно" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            var message = ex.InnerException?.Message ?? ex.Message;
            return BadRequest(new { message = $"Помилка призначення: {message}" });
        }
    }

    [HttpPost("{id}/unassign/{driverId}")]
    public async Task<IActionResult> Unassign(int id, int driverId)
    {
        try
        {
            var managerId = GetCurrentManagerId();
            await _vehicleService.UnassignVehicleAsync(id, driverId, managerId);
            return Ok(new { message = "Призначення скасовано успішно" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            var message = ex.InnerException?.Message ?? ex.Message;
            return BadRequest(new { message = $"Помилка скасування: {message}" });
        }
    }

    [HttpPost("{id}/maintenance")]
    public async Task<IActionResult> PerformMaintenance(int id)
    {
        try
        {
            var managerId = GetCurrentManagerId();
            await _vehicleService.PerformMaintenanceAsync(id, managerId);
            return Ok(new { message = "ТО проведено успішно" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
