using System.Security.Claims;
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

        // DEV MODE: Return default User ID (1) if no token is present
        return 1; 
    }
}
