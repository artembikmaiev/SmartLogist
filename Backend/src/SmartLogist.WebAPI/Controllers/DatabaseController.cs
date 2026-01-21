using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DatabaseController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DatabaseController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Test database connection
    /// </summary>
    [HttpGet("test-connection")]
    public async Task<IActionResult> TestConnection()
    {
        try
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
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                Status = "Error",
                Message = ex.Message,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
