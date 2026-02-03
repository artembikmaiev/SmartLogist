using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.Infrastructure.Repositories;

public class TripRepository : ITripRepository
{
    private readonly ApplicationDbContext _context;

    public TripRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Trip?> GetByIdAsync(int id)
    {
        return await _context.Trips
            .Include(t => t.Driver)
            .Include(t => t.Vehicle)
            .Include(t => t.Manager)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<IEnumerable<Trip>> GetByDriverIdAsync(int driverId)
    {
        return await _context.Trips
            .Include(t => t.Vehicle)
            .Include(t => t.Manager)
            .Where(t => t.DriverId == driverId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Trip>> GetByManagerIdAsync(int managerId)
    {
        return await _context.Trips
            .Include(t => t.Driver)
            .Include(t => t.Vehicle)
            .Where(t => t.ManagerId == managerId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<Trip> AddAsync(Trip trip)
    {
        await _context.Trips.AddAsync(trip);
        await _context.SaveChangesAsync();
        return trip;
    }

    public async Task UpdateAsync(Trip trip)
    {
        _context.Trips.Update(trip);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetCompletedCountByDriverIdAsync(int driverId)
    {
        return await _context.Trips
            .CountAsync(t => t.DriverId == driverId && t.Status == TripStatus.Completed);
    }

    public async Task<decimal> GetTotalEarningsByDriverIdAsync(int driverId, int month, int year)
    {
        return await _context.Trips
            .Where(t => t.DriverId == driverId && 
                        t.Status == TripStatus.Completed && 
                        t.ActualArrival.HasValue && 
                        t.ActualArrival.Value.Month == month && 
                        t.ActualArrival.Value.Year == year)
            .SumAsync(t => t.PaymentAmount);
    }

    public async Task<decimal> GetTotalDistanceByDriverIdAsync(int driverId, int month, int year)
    {
        return await _context.Trips
            .Where(t => t.DriverId == driverId && 
                        t.Status == TripStatus.Completed && 
                        t.ActualArrival.HasValue && 
                        t.ActualArrival.Value.Month == month && 
                        t.ActualArrival.Value.Year == year)
            .SumAsync(t => t.DistanceKm);
    }

    public async Task<double?> GetAverageRatingByDriverIdAsync(int driverId)
    {
        var ratings = await _context.Trips
            .Where(t => t.DriverId == driverId && t.Status == TripStatus.Completed && t.Rating.HasValue)
            .Select(t => t.Rating!.Value)
            .ToListAsync();

        if (ratings.Count == 0) return null;
        return ratings.Average();
    }

    public async Task DeleteAsync(int id)
    {
        var trip = await _context.Trips.FindAsync(id);
        if (trip != null)
        {
            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
        }
    }
}
