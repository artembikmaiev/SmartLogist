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

    // Отримати всіх менеджерів
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var managers = await _managerService.GetAllManagersAsync();
        return Ok(managers);
    }

    // Отримати менеджера за ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var manager = await _managerService.GetManagerByIdAsync(id);
        
        if (manager == null)
            return NotFound(new { Message = "Менеджера не знайдено" });

        return Ok(manager);
    }

    // Створити нового менеджера
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

    // Оновити менеджера
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateManagerDto dto)
    {
        var manager = await _managerService.UpdateManagerAsync(id, dto);
        
        if (manager == null)
            return NotFound(new { Message = "Менеджера не знайдено" });

        return Ok(manager);
    }

    // Видалити менеджера
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

    // Отримати всі доступні дозволи
    [HttpGet("~/api/admin/permissions")]
    public async Task<IActionResult> GetAllPermissions()
    {
        var permissions = await _managerService.GetAllPermissionsAsync();
        return Ok(permissions);
    }

    // Отримати дозволи для конкретного менеджера
    [HttpGet("{id}/permissions")]
    public async Task<IActionResult> GetManagerPermissions(int id)
    {
        try
        {
            var permissions = await _managerService.GetManagerPermissionsAsync(id);
            return Ok(permissions);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    // Надати дозвіл менеджеру
    [HttpPost("{id}/permissions/{permissionId}")]
    public async Task<IActionResult> GrantPermission(int id, int permissionId)
    {
        try
        {
            await _managerService.GrantPermissionAsync(id, permissionId);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    // Скасувати дозвіл від менеджера
    [HttpDelete("{id}/permissions/{permissionId}")]
    public async Task<IActionResult> RevokePermission(int id, int permissionId)
    {
        try
        {
            await _managerService.RevokePermissionAsync(id, permissionId);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
