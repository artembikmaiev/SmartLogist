using Microsoft.AspNetCore.Authorization;
// Контролер, відповідальний за аутентифікацію користувачів, обробку входу та реєстрації.
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
        // Видалення токена буде оброблено на стороні клієнта
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

    // POST: api/auth/change-password
    // [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = GetUserId();
        await _authService.ChangePasswordAsync(userId, dto);
        return Ok(new { Message = "Пароль змінено успішно" });
    }

    // GET: api/auth/check-admin
    [HttpGet("check-admin")]
    public async Task<IActionResult> CheckAdmin()
    {
        var exists = await _authService.AnyAdminExistsAsync();
        return Ok(new { Exists = exists });
    }

    // POST: api/auth/setup-admin
    [HttpPost("setup-admin")]
    public async Task<IActionResult> SetupAdmin([FromBody] RegisterAdminDto dto)
    {
        try
        {
            var response = await _authService.RegisterFirstAdminAsync(dto);
            return Ok(response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    // POST: api/auth/reset-password/{userId}
    // [Authorize(Roles = "admin,manager")]
    [HttpPost("reset-password/{userId}")]
    public async Task<IActionResult> ResetPassword(int userId, [FromBody] ResetPasswordDto dto)
    {
        await _authService.ResetUserPasswordAsync(userId, dto.NewPassword);
        return Ok(new { Message = "Пароль скинуто успішно" });
    }
}
