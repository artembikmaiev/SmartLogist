// Цей інтерфейс описує операції з даними рейсів, включаючи фільтрацію та підрахунок статистики.
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Interfaces;

public interface ITripRepository
{
    Task<Trip?> GetByIdAsync(int id, DateTime scheduledDeparture);
    Task<Trip?> GetWithDetailsAsync(int id, DateTime scheduledDeparture);
    Task<IEnumerable<Trip>> GetByDriverIdAsync(int driverId);
    Task<IEnumerable<Trip>> GetByManagerIdAsync(int managerId);
    Task<Trip> AddAsync(Trip trip);
    Task UpdateAsync(Trip trip);
    Task ChangeStatusAsync(int id, TripStatus status);
    Task<int> GetCompletedCountByDriverIdAsync(int driverId);
    Task<decimal> GetTotalEarningsByDriverIdAsync(int driverId, int month, int year);
    Task<decimal> GetTotalDistanceByDriverIdAsync(int driverId, int month, int year);
    Task<double?> GetAverageRatingByDriverIdAsync(int driverId);
    Task<Trip?> GetByOnlyIdAsync(int id);
    Task UpdateTripFieldsAsync(Trip trip);
    Task DeleteAsync(int id, DateTime scheduledDeparture);
}
 
