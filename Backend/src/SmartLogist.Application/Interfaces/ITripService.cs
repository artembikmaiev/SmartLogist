using SmartLogist.Application.DTOs.Trip;

namespace SmartLogist.Application.Interfaces;

public interface ITripService
{
    Task<IEnumerable<TripDto>> GetDriverTripsAsync(int driverId);
    Task<DriverStatsSummaryDto> GetDriverStatsSummaryAsync(int driverId);
    Task AcceptTripAsync(int tripId, int driverId);
    Task DeclineTripAsync(int tripId, int driverId);
}
