using SmartLogist.Domain.Enums;

namespace SmartLogist.Application.DTOs.Trip;

public class UpdateTripDto
{
    public string? Status { get; set; }
    public DateTime? ActualDeparture { get; set; }
    public DateTime? ActualArrival { get; set; }
    public string? Notes { get; set; }
    public double? ActualFuelConsumption { get; set; }
    public int? Rating { get; set; }
    public string? ManagerReview { get; set; }
}
