// Контролер для перевірки працездатності API та базових сервісів системи.
using Microsoft.AspNetCore.Mvc;

namespace SmartLogist.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Кінцева точка перевірки працездатності
    /// </summary>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Service = "SmartLogist API",
            Version = "1.0.0"
        });
    }
}
