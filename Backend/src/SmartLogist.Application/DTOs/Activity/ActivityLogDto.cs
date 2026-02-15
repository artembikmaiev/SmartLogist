// Об'єкт передачі даних для запису активності користувача в системі логування.
namespace SmartLogist.Application.DTOs.Activity;

public class ActivityLogDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? Details { get; set; }
    public string? EntityType { get; set; }
    public string? EntityId { get; set; }
    public DateTime CreatedAt { get; set; }
}
