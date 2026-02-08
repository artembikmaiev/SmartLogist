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
            .Include(t => t.Driver)
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
            // Use Attach instead of Update to avoid marking the entire graph (Driver, Manager, etc.) as modified
            _context.Trips.Attach(trip);
            entry.State = EntityState.Modified;
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

    public async Task UpdateTripFieldsAsync(Trip trip)
    {
        // First, get the exact scheduled_departure from DB (it's part of the PK and cannot be modified)
        var rawDeparture = await _context.Trips
            .Where(t => t.Id == trip.Id)
            .Select(t => t.ScheduledDeparture)
            .FirstOrDefaultAsync();

        if (rawDeparture == default)
        {
            throw new KeyNotFoundException($"Trip with ID {trip.Id} not found");
        }

        // CRITICAL: Ensure we use the exact UTC Kind for the partition key match
        var exactDeparture = DateTime.SpecifyKind(rawDeparture, DateTimeKind.Utc);

        // Use explicit transaction to ensure ExecuteUpdate and SaveChanges/FK check are atomic
        // and visible to each other within the same transaction scope.
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Update Trip fields atomically using ExecuteUpdateAsync (no tracking issues)
            // Target by composite PK: (id, scheduled_departure)
            await _context.Trips
                .Where(t => t.Id == trip.Id && t.ScheduledDeparture == exactDeparture)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(t => t.Status, trip.Status)
                    .SetProperty(t => t.ActualDeparture, trip.ActualDeparture)
                    .SetProperty(t => t.ActualArrival, trip.ActualArrival)
                    .SetProperty(t => t.Notes, trip.Notes)
                    .SetProperty(t => t.ActualFuelConsumption, trip.ActualFuelConsumption)
                    .SetProperty(t => t.ExpectedProfit, trip.ExpectedProfit)
                    .SetProperty(t => t.EstimatedFuelCost, trip.EstimatedFuelCost)
                    .SetProperty(t => t.IsMileageAccounted, trip.IsMileageAccounted)
                    .SetProperty(t => t.DistanceKm, trip.DistanceKm)
                    .SetProperty(t => t.PaymentAmount, trip.PaymentAmount)
                );

            // Handle Feedback in the same transaction
            if (trip.Feedback != null)
            {
                var existingFeedback = await _context.TripFeedbacks
                    .FirstOrDefaultAsync(f => f.TripId == trip.Id && f.DepartureTime == exactDeparture);

                if (existingFeedback == null)
                {
                    // Create new feedback with EXACT departure time
                    var newFeedback = new TripFeedback
                    {
                        TripId = trip.Id,
                        DepartureTime = exactDeparture,
                        Rating = trip.Feedback.Rating,
                        ManagerReview = trip.Feedback.ManagerReview
                    };
                    await _context.TripFeedbacks.AddAsync(newFeedback);
                }
                else
                {
                    existingFeedback.Rating = trip.Feedback.Rating;
                    existingFeedback.ManagerReview = trip.Feedback.ManagerReview;
                }

                // Save feedback within transaction
                await _context.SaveChangesAsync();
            }

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
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
