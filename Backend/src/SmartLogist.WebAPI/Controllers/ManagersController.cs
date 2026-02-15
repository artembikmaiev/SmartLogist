using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Manager;
using SmartLogist.Application.Interfaces;
// Контролер для управління обліковими записами менеджерів та їхніми повноваженнями в системі.
using Microsoft.AspNetCore.Authorization;

namespace SmartLogist.WebAPI.Controllers;

// [Authorize(Roles = "Manager,Admin")]
[Route("api/admin/[controller]")]
public class ManagersController : BaseApiController
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
        var manager = await _managerService.CreateManagerAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = manager.Id }, manager);
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
        var result = await _managerService.DeleteManagerAsync(id);
        
        if (!result)
            return NotFound(new { Message = "Менеджера не знайдено" });

        return NoContent();
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
        var permissions = await _managerService.GetManagerPermissionsAsync(id);
        return Ok(permissions);
    }

    // Надати дозвіл менеджеру
    [HttpPost("{id}/permissions/{permissionId}")]
    public async Task<IActionResult> GrantPermission(int id, int permissionId)
    {
        await _managerService.GrantPermissionAsync(id, permissionId);
        return NoContent();
    }

    // Скасувати дозвіл від менеджера
    [HttpDelete("{id}/permissions/{permissionId}")]
    public async Task<IActionResult> RevokePermission(int id, int permissionId)
    {
        await _managerService.RevokePermissionAsync(id, permissionId);
        return NoContent();
    }
}
