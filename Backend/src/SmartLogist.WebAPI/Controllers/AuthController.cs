using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.Auth;
using SmartLogist.Application.Interfaces;
using System.Security.Claims;

namespace SmartLogist.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var response = await _authService.LoginAsync(loginDto);
        return Ok(response);
    }

    // POST: api/auth/logout
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // Client-side will handle token removal
        return Ok(new { Message = "Вихід успішний" });
    }

    // GET: api/auth/me
    // [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = GetUserId();
        var user = await _authService.GetUserByIdAsync(userId);
        
        if (user == null)
        {
            return NotFound(new { Message = "Користувача не знайдено" });
        }

        return Ok(user);
    }

    // PUT: api/auth/profile
    // [Authorize]
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = GetUserId();
        await _authService.UpdateProfileAsync(userId, dto);
        return Ok(new { Message = "Профіль оновлено успішно" });
    }
}
