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

    public async Task<Trip?> GetByIdAsync(int id, DateTime scheduledDeparture)
    {
        return await _context.Trips
            .AsNoTracking()
            .Include(t => t.Origin)
            .Include(t => t.Destination)
            .Include(t => t.Cargo)
            .Include(t => t.Driver)
            .Include(t => t.Vehicle)
            .Include(t => t.Manager)
            .FirstOrDefaultAsync(t => t.Id == id && t.ScheduledDeparture == scheduledDeparture);
    }

    public async Task<Trip?> GetWithDetailsAsync(int id, DateTime scheduledDeparture)
    {
        return await _context.Trips
            .AsNoTracking()
            .Include(t => t.Origin)
            .Include(t => t.Destination)
            .Include(t => t.Cargo)
            .Include(t => t.Driver)
            .Include(t => t.Vehicle)
            .Include(t => t.Manager)
            .Include(t => t.Route)
            .Include(t => t.Feedback)
            .FirstOrDefaultAsync(t => t.Id == id && t.ScheduledDeparture == scheduledDeparture);
    }

    public async Task<IEnumerable<Trip>> GetByDriverIdAsync(int driverId)
    {
        return await _context.Trips
            .AsNoTracking()
            .Include(t => t.Origin)
            .Include(t => t.Destination)
            .Include(t => t.Cargo)
            .Include(t => t.Vehicle)
            .Include(t => t.Manager)
            .Include(t => t.Feedback)
            .Include(t => t.Route)
            .Where(t => t.DriverId == driverId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Trip>> GetByManagerIdAsync(int managerId)
    {
        return await _context.Trips
            .AsNoTracking()
            .Include(t => t.Origin)
            .Include(t => t.Destination)
            .Include(t => t.Cargo)
            .Include(t => t.Driver)
            .Include(t => t.Vehicle)
            .Include(t => t.Feedback)
            .Include(t => t.Route)
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
        var entry = _context.Entry(trip);
        if (entry.State == EntityState.Detached)
        {
            _context.Trips.Update(trip);
        }
        await _context.SaveChangesAsync();
    }

    public async Task ChangeStatusAsync(int id, TripStatus status)
    {
        // ExecuteUpdateAsync allows us to bypass the composite key (Id, ScheduledDeparture) tracking issues
        // and target the row by ID alone for status changes.
        await _context.Trips
            .Where(t => t.Id == id)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.Status, status));
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
        var ratings = await _context.TripFeedbacks
            .Include(f => f.Trip)
            .Where(f => f.Trip.DriverId == driverId && f.Trip.Status == TripStatus.Completed && f.Rating.HasValue)
            .Select(f => (double)f.Rating!.Value)
            .ToListAsync();

        if (ratings.Count == 0) return null;
        return ratings.Average();
    }

    public async Task<Trip?> GetByOnlyIdAsync(int id)
    {
        return await _context.Trips
            .AsNoTracking()
            .Include(t => t.Origin)
            .Include(t => t.Destination)
            .Include(t => t.Cargo)
            .Include(t => t.Driver)
            .Include(t => t.Vehicle)
            .Include(t => t.Manager)
            .Include(t => t.Route)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task DeleteAsync(int id, DateTime scheduledDeparture)
    {
        var trip = await _context.Trips.FindAsync(id, scheduledDeparture);
        if (trip != null)
        {
            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
        }
    }
}
