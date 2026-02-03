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

        return new AuthResponseDto
        {
            Token = token,
            User = await MapToUserInfoDto(user)
        };
    }

    public async Task<UserInfoDto?> GetUserByIdAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null)
        {
            return null;
        }

        return await MapToUserInfoDto(user);
    }

    private async Task<UserInfoDto> MapToUserInfoDto(SmartLogist.Domain.Entities.User user)
    {
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

        var primaryVehicle = user.AssignedVehicles?.FirstOrDefault(dv => dv.IsPrimary);

        return new UserInfoDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Phone = user.Phone,
            Role = user.Role.ToString().ToLower(),
            LicenseNumber = user.LicenseNumber,
            Status = user.DriverStatus?.ToString() ?? "Offline",
            AssignedVehicle = primaryVehicle != null ? new DriverVehicleInfoDto
            {
                VehicleId = primaryVehicle.VehicleId,
                Model = primaryVehicle.Vehicle?.Model ?? string.Empty,
                LicensePlate = primaryVehicle.Vehicle?.LicensePlate ?? string.Empty,
                KmUntilMaintenance = primaryVehicle.Vehicle != null 
                    ? Math.Max(0, 10000 - (primaryVehicle.Vehicle.TotalMileage - primaryVehicle.Vehicle.MileageAtLastMaintenance))
                    : 0
            } : null,
            CreatedAt = user.CreatedAt,
            Permissions = permissions
        };
    }

    public async Task UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            throw new KeyNotFoundException("Користувача не знайдено");
        }

        // Перевірити наявність email, якщо він змінився
        if (user.Email != dto.Email && await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("Цей email вже використовується іншим користувачем");
        }

        // Перевірити наявність телефону, якщо він змінився
        if (!string.IsNullOrEmpty(dto.Phone) && user.Phone != dto.Phone && await _userRepository.PhoneExistsAsync(dto.Phone))
        {
            throw new InvalidOperationException("Цей номер телефону вже використовується іншим користувачем");
        }

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.Phone = dto.Phone;

        await _userRepository.UpdateAsync(user);
    }
}
