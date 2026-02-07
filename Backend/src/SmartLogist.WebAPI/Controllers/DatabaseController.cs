using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.WebAPI.Controllers;

[Authorize(Roles = "Admin")]
public class DatabaseController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public DatabaseController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        var canConnect = await _context.Database.CanConnectAsync();
        
        if (canConnect)
        {
            return Ok(new
            {
                Status = "Success",
                Message = "Successfully connected to PostgreSQL database",
                Database = _context.Database.GetConnectionString(),
                Timestamp = DateTime.UtcNow
            });
        }
        else
        {
            return StatusCode(500, new
            {
                Status = "Error",
                Message = "Cannot connect to database",
                Timestamp = DateTime.UtcNow
            });
        }
    }

    [HttpPost("migrate")]
    public async Task<IActionResult> ApplyMigrations()
    {
        await _context.Database.MigrateAsync();
        return Ok(new { Message = "Міграції успішно застосовано" });
    }

    [HttpPost("reset")]
    public async Task<IActionResult> ResetDatabase()
    {
        await _context.Database.EnsureDeletedAsync();
        await _context.Database.MigrateAsync();
        return Ok(new { Message = "Базу даних скинуто" });
    }
}
