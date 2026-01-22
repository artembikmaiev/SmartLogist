using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Manager;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.WebAPI.Controllers;

[ApiController]
[Route("api/admin/[controller]")]
public class ManagersController : ControllerBase
{
    private readonly IManagerService _managerService;

    public ManagersController(IManagerService managerService)
    {
        _managerService = managerService;
    }

    // Get all managers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var managers = await _managerService.GetAllManagersAsync();
        return Ok(managers);
    }

    // Get manager by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var manager = await _managerService.GetManagerByIdAsync(id);
        
        if (manager == null)
            return NotFound(new { Message = "Менеджера не знайдено" });

        return Ok(manager);
    }

    // Create new manager
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateManagerDto dto)
    {
        try
        {
            var manager = await _managerService.CreateManagerAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = manager.Id }, manager);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    // Update manager
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateManagerDto dto)
    {
        var manager = await _managerService.UpdateManagerAsync(id, dto);
        
        if (manager == null)
            return NotFound(new { Message = "Менеджера не знайдено" });

        return Ok(manager);
    }

    // Delete manager
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _managerService.DeleteManagerAsync(id);
            
            if (!result)
                return NotFound(new { Message = "Менеджера не знайдено" });

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
