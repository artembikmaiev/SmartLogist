using SmartLogist.Domain.Enums;

// Об'єкти передачі даних для створення та обробки запитів на адміністрування.
namespace SmartLogist.Application.DTOs.AdminRequest;

public class AdminRequestDto
{
    public int Id { get; set; }
    public RequestType Type { get; set; }
    public RequestStatus Status { get; set; }
    public int RequesterId { get; set; }
    public string RequesterName { get; set; } = string.Empty;
    public int? TargetId { get; set; }
    public string TargetName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public string? AdminResponse { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public string? ProcessedBy { get; set; }
}

public class CreateRequestDto
{
    public RequestType Type { get; set; }
    public int? TargetId { get; set; }
    public string TargetName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
}

public class ProcessRequestDto
{
    public bool Approved { get; set; }
    public string? Response { get; set; }
}
