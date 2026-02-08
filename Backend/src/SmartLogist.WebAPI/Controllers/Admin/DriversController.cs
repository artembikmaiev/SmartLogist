using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Driver;
using SmartLogist.Application.DTOs.Vehicle;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.WebAPI.Controllers.Admin;

// [Authorize(Roles = "Manager,Admin")]
[Route("api/admin/drivers")]
public class DriversController : BaseApiController
{
    private readonly IDriverService _driverService;
    private readonly IVehicleService _vehicleService;

    public DriversController(IDriverService driverService, IVehicleService vehicleService)
    {
        _driverService = driverService;
        _vehicleService = vehicleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var drivers = await _driverService.GetAllDriversAdminAsync();
        return Ok(drivers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var driver = await _driverService.GetDriverByIdAdminAsync(id);
        if (driver == null) return NotFound(new { Message = "Водія не знайдено" });
        return Ok(driver);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDriverDto dto)
    {
        var driver = await _driverService.CreateDriverAdminAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = driver.Id }, driver);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateDriverDto dto)
    {
        var driver = await _driverService.UpdateDriverAdminAsync(id, dto);
        return Ok(driver);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _driverService.DeleteDriverAdminAsync(id);
        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _driverService.GetAdminDriverStatsAsync();
        return Ok(stats);
    }

    [HttpPost("{id}/assign-manager")]
    public async Task<IActionResult> AssignManager(int id, [FromBody] AssignManagerDto dto)
    {
        await _driverService.AssignManagerAsync(id, dto.ManagerId);
        return NoContent();
    }

    [HttpGet("vehicles")]
    public async Task<IActionResult> GetAllVehicles()
    {
        var vehicles = await _vehicleService.GetAllVehiclesAdminAsync();
        return Ok(vehicles);
    }

    [HttpPost("vehicles")]
    public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleDto dto)
    {
        var vehicle = await _vehicleService.CreateVehicleAdminAsync(dto);
        return Ok(vehicle);
    }

    [HttpPut("vehicles/{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] UpdateVehicleDto dto)
    {
        var vehicle = await _vehicleService.UpdateVehicleAdminAsync(id, dto);
        return Ok(vehicle);
    }

    [HttpDelete("vehicles/{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        await _vehicleService.DeleteVehicleAdminAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/assign-vehicle")]
    public async Task<IActionResult> AssignVehicle(int id, [FromBody] int vehicleId)
    {
        await _driverService.AssignVehicleAsync(id, vehicleId);
        return NoContent();
    }

    [HttpPost("{id}/unassign-vehicle")]
    public async Task<IActionResult> UnassignVehicle(int id, [FromBody] int vehicleId)
    {
        await _driverService.UnassignVehicleAsync(id, vehicleId);
        return NoContent();
    }
}
