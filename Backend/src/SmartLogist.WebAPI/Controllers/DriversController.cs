using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Driver;
using SmartLogist.Application.Interfaces;
using System.Security.Claims;
using SmartLogist.Domain.Enums;

namespace SmartLogist.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DriversController : ControllerBase
{
    private readonly IDriverService _driverService;

    public DriversController(IDriverService driverService)
    {
        _driverService = driverService;
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

    // GET: api/drivers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var managerId = GetUserId();
            var drivers = await _driverService.GetDriversByManagerIdAsync(managerId);
            return Ok(drivers);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    // GET: api/drivers/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var managerId = GetUserId();
            var driver = await _driverService.GetDriverByIdAsync(id, managerId);
            
            if (driver == null)
            {
                return NotFound(new { Message = "Водія не знайдено" });
            }

            return Ok(driver);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    // POST: api/drivers
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDriverDto dto)
    {
        try
        {
            var managerId = GetUserId();
            var driver = await _driverService.CreateDriverAsync(dto, managerId);
            return CreatedAtAction(nameof(GetById), new { id = driver.Id }, driver);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException ex)
        {
            // Check if it's a unique constraint violation
            if (ex.InnerException?.Message.Contains("duplicate key") == true || 
                ex.InnerException?.Message.Contains("UNIQUE constraint") == true)
            {
                return Conflict(new { message = "Користувач з таким email вже існує" });
            }
            return BadRequest(new { message = "Помилка при збереженні даних: " + ex.InnerException?.Message ?? ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/drivers/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDriverDto dto)
    {
        try
        {
            var managerId = GetUserId();
            var driver = await _driverService.UpdateDriverAsync(id, dto, managerId);
            return Ok(driver);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
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

    // DELETE: api/drivers/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var managerId = GetUserId();
            await _driverService.DeleteDriverAsync(id, managerId);
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(403, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    // GET: api/drivers/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        try
        {
            var managerId = GetUserId();
            var stats = await _driverService.GetDriverStatsAsync(managerId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    // PUT: api/drivers/status
    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus([FromBody] UpdateDriverStatusDto dto)
    {
        try
        {
            var driverId = GetUserId();

            await _driverService.UpdateStatusAsync(driverId, dto.Status);
            return Ok(new { Message = "Статус оновлено успішно" });
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
}
