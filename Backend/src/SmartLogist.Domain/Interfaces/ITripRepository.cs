using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Interfaces;

public interface ITripRepository
{
    Task<Trip?> GetByIdAsync(int id);
    Task<IEnumerable<Trip>> GetByDriverIdAsync(int driverId);
    Task<IEnumerable<Trip>> GetByManagerIdAsync(int managerId);
    Task<Trip> AddAsync(Trip trip);
    Task UpdateAsync(Trip trip);
    Task<int> GetCompletedCountByDriverIdAsync(int driverId);
    Task<decimal> GetTotalEarningsByDriverIdAsync(int driverId, int month, int year);
    Task<decimal> GetTotalDistanceByDriverIdAsync(int driverId, int month, int year);
    Task<double?> GetAverageRatingByDriverIdAsync(int driverId);
    Task DeleteAsync(int id);
}
