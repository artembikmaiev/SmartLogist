using SmartLogist.Application.DTOs.Auth;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtService _jwtService;

    public AuthService(IUserRepository userRepository, JwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
    {
        // Знайти користувача за електронною адресою
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);
        
        if (user == null)
        {
            throw new UnauthorizedAccessException("Невірний email або пароль");
        }

        // Підтвердіти пароль
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Невірний email або пароль");
        }

        // Перевірити, чи користувач активний
        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Обліковий запис деактивовано");
        }

        // Створити токен JWT
        var token = _jwtService.GenerateToken(user);

        // Отримати дозволи для менеджерів
        List<PermissionDto>? permissions = null;
        if (user.Role == Domain.Enums.UserRole.Manager)
        {
            var userPermissions = await _userRepository.GetManagerPermissionsAsync(user.Id);
            permissions = userPermissions.Select(mp => new PermissionDto
            {
                Id = mp.Permission.Id,
                Code = mp.Permission.Code,
                Name = mp.Permission.Name,
                Description = mp.Permission.Description,
                Category = mp.Permission.Category
            }).ToList();
        }

        return new AuthResponseDto
        {
            Token = token,
            User = new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                Role = user.Role.ToString().ToLower(),
                Permissions = permissions
            }
        };
    }

    public async Task<UserInfoDto?> GetUserByIdAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
        {
            return null;
        }

        // Отримати дозволи для менеджерів
        List<PermissionDto>? permissions = null;
        if (user.Role == Domain.Enums.UserRole.Manager)
        {
            var userPermissions = await _userRepository.GetManagerPermissionsAsync(user.Id);
            permissions = userPermissions.Select(mp => new PermissionDto
            {
                Id = mp.Permission.Id,
                Code = mp.Permission.Code,
                Name = mp.Permission.Name,
                Description = mp.Permission.Description,
                Category = mp.Permission.Category
            }).ToList();
        }

        return new UserInfoDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role.ToString().ToLower(),
            Permissions = permissions
        };
    }
}
