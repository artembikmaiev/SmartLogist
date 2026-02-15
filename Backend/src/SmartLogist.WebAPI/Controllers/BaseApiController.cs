using System.Security.Claims;
// Базовий контролер з загальними налаштуваннями маршрутизації та атрибутами для всіх API-контролерів.
using Microsoft.AspNetCore.Mvc;

namespace SmartLogist.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseApiController : ControllerBase
{
    protected int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
        {
            return userId;
        }

        // РЕЖИМ РОЗРОБКИ: Повертати ID користувача за замовчуванням (1), якщо токен відсутній
        return 1; 
    }
}
