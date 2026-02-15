// Об'єкт передачі даних для реєстрації нового менеджера з визначенням його ролі та доступу.
// Об'єкт передачі даних для реєстрації нового менеджера з визначенням його ролі та доступу.
namespace SmartLogist.Application.DTOs.Manager;

public class CreateManagerDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
}
