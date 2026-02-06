namespace SmartLogist.Domain.Entities;

public class TripFeedback
{
    public int TripId { get; set; }
    public DateTime DepartureTime { get; set; }
    public int? Rating { get; set; }
    public string? ManagerReview { get; set; }
    
    public virtual Trip Trip { get; set; } = null!;
}
