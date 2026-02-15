// Об'єкт передачі даних для оновлення особистої інформації користувача в його профілі.
namespace SmartLogist.Application.DTOs.Auth;

public class UpdateProfileDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
}
