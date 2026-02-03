using SmartLogist.Application.DTOs.Trip;

namespace SmartLogist.Application.Interfaces;

public interface ITripService
{
    Task<IEnumerable<TripDto>> GetDriverTripsAsync(int driverId);
    Task<DriverStatsSummaryDto> GetDriverStatsSummaryAsync(int driverId);
    Task AcceptTripAsync(int tripId, int driverId);
    Task DeclineTripAsync(int tripId, int driverId);
    Task UpdateTripAsync(int tripId, UpdateTripDto dto);

    // Manager operations
    Task<TripDto> CreateTripAsync(CreateTripDto dto, int managerId);
    Task<IEnumerable<TripDto>> GetManagerTripsAsync(int managerId);
    Task<ManagerStatsSummaryDto> GetManagerStatsSummaryAsync(int managerId);
    Task DeleteTripAsync(int tripId, int managerId);
}
