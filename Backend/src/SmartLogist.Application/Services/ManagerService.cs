using SmartLogist.Application.DTOs.Manager;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;
using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public class ManagerService : IManagerService
{
    private readonly IUserRepository _userRepository;

    public ManagerService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<ManagerDto>> GetAllManagersAsync()
    {
        var managers = await _userRepository.GetAllManagersAsync();
        
        return managers.Select(m => new ManagerDto
        {
            Id = m.Id,
            Email = m.Email,
            FullName = m.FullName,
            Phone = m.Phone,
            IsActive = m.IsActive,
            CreatedAt = m.CreatedAt,
            ActiveDriversCount = m.ManagedDrivers.Count(d => d.IsActive),
            Permissions = m.ManagerPermissions.Select(mp => mp.Permission.Code).ToList()
        });
    }

    public async Task<ManagerDto?> GetManagerByIdAsync(int id)
    {
        var manager = await _userRepository.GetByIdAsync(id);
        
        if (manager == null || manager.Role != UserRole.Manager)
            return null;

        return new ManagerDto
        {
            Id = manager.Id,
            Email = manager.Email,
            FullName = manager.FullName,
            Phone = manager.Phone,
            IsActive = manager.IsActive,
            CreatedAt = manager.CreatedAt,
            ActiveDriversCount = manager.ManagedDrivers.Count(d => d.IsActive),
            Permissions = manager.ManagerPermissions.Select(mp => mp.Permission.Code).ToList()
        };
    }

    public async Task<ManagerDto> CreateManagerAsync(CreateManagerDto dto)
    {
        // Перевірка, чи існує електронна адреса
        if (await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("Email вже використовується");
        }

        // Перевірка, чи телефон вже існує (якщо вказано)
        if (!string.IsNullOrEmpty(dto.Phone) && await _userRepository.PhoneExistsAsync(dto.Phone))
        {
            throw new InvalidOperationException("Телефон вже використовується");
        }

        var manager = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.Manager,
            FullName = dto.FullName,
            Phone = dto.Phone,
            IsActive = true,
            CreatedAt = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)
        };

        var createdManager = await _userRepository.AddAsync(manager);

        return new ManagerDto
        {
            Id = createdManager.Id,
            Email = createdManager.Email,
            FullName = createdManager.FullName,
            Phone = createdManager.Phone,
            IsActive = createdManager.IsActive,
            CreatedAt = createdManager.CreatedAt,
            ActiveDriversCount = 0,
            Permissions = new List<string>()
        };
    }

    public async Task<ManagerDto?> UpdateManagerAsync(int id, UpdateManagerDto dto)
    {
        var manager = await _userRepository.GetByIdAsync(id);
        
        if (manager == null || manager.Role != UserRole.Manager)
            return null;

        manager.FullName = dto.FullName;
        manager.Phone = dto.Phone;
        manager.IsActive = dto.IsActive;

        await _userRepository.UpdateAsync(manager);

        return new ManagerDto
        {
            Id = manager.Id,
            Email = manager.Email,
            FullName = manager.FullName,
            Phone = manager.Phone,
            IsActive = manager.IsActive,
            CreatedAt = manager.CreatedAt,
            ActiveDriversCount = manager.ManagedDrivers.Count(d => d.IsActive),
            Permissions = manager.ManagerPermissions.Select(mp => mp.Permission.Code).ToList()
        };
    }

    public async Task<bool> DeleteManagerAsync(int id)
    {
        var manager = await _userRepository.GetByIdAsync(id);
        
        if (manager == null || manager.Role != UserRole.Manager)
            return false;

        // Перевірка, чи є у менеджера активні водії
        var activeDriversCount = await _userRepository.GetActiveDriversCountAsync(id);
        if (activeDriversCount > 0)
        {
            throw new InvalidOperationException($"Неможливо видалити менеджера з {activeDriversCount} активними водіями");
        }

        await _userRepository.DeleteAsync(id);
        return true;
    }
}
