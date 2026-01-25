using SmartLogist.Application.DTOs.Auth;

namespace SmartLogist.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
    Task<UserInfoDto?> GetUserByIdAsync(int userId);
    Task UpdateProfileAsync(int userId, UpdateProfileDto dto);
}
