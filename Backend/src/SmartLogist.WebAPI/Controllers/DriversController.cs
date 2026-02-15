// Контролер для управління даними водіїв, перегляду їх статистики та зміни їхнього статусу.
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Driver;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Enums;

namespace SmartLogist.WebAPI.Controllers;

// [Authorize]
public class DriversController : BaseApiController
{
    private readonly IDriverService _driverService;

    public DriversController(IDriverService driverService)
    {
        _driverService = driverService;
    }

    // GET: api/drivers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var managerId = GetUserId();
        var drivers = await _driverService.GetDriversByManagerIdAsync(managerId);
        return Ok(drivers);
    }

    // GET: api/drivers/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var managerId = GetUserId();
        var driver = await _driverService.GetDriverByIdAsync(id, managerId);
        
        if (driver == null)
        {
            throw new KeyNotFoundException("Водія не знайдено");
        }

        return Ok(driver);
    }

    // POST: api/drivers
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDriverDto dto)
    {
        var managerId = GetUserId();
        var driver = await _driverService.CreateDriverAsync(dto, managerId);
        return CreatedAtAction(nameof(GetById), new { id = driver.Id }, driver);
    }

    // PUT: api/drivers/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDriverDto dto)
    {
        var managerId = GetUserId();
        var driver = await _driverService.UpdateDriverAsync(id, dto, managerId);
        return Ok(driver);
    }

    // DELETE: api/drivers/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var managerId = GetUserId();
        await _driverService.DeleteDriverAsync(id, managerId);
        return NoContent();
    }

    // GET: api/drivers/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var managerId = GetUserId();
        var stats = await _driverService.GetDriverStatsAsync(managerId);
        return Ok(stats);
    }

    // PUT: api/drivers/status
    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus([FromBody] UpdateDriverStatusDto dto)
    {
        var driverId = GetUserId();

        await _driverService.UpdateStatusAsync(driverId, dto.Status);
        return Ok(new { Message = "Статус оновлено успішно" });
    }

    // PUT: api/drivers/profile
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateDriverSelfDto dto)
    {
        var driverId = GetUserId();
        var driver = await _driverService.UpdateSelfAsync(driverId, dto);
        return Ok(driver);
    }
}
