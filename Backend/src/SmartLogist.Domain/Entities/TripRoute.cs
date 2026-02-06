namespace SmartLogist.Domain.Entities;

public class TripRoute
{
    public int TripId { get; set; }
    public DateTime DepartureTime { get; set; }
    public string RouteGeometry { get; set; } = string.Empty; // JSONB storage as string
    
    public virtual Trip Trip { get; set; } = null!;
}
