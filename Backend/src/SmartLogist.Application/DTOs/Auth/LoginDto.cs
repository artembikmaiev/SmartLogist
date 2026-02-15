// Об'єкт передачі даних для входу в систему, що містить електронну пошту та пароль користувача.
namespace SmartLogist.Application.DTOs.Auth;

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
