using SmartLogist.Application.DTOs.Analytics;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Enums;
using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public class AnalyticsService : BaseService, IAnalyticsService
{
    private readonly ITripRepository _tripRepository;

    public AnalyticsService(
        ITripRepository tripRepository, 
        IUserRepository userRepository,
        IPermissionRepository permissionRepository) : base(userRepository, permissionRepository)
    {
        _tripRepository = tripRepository;
    }

    public async Task<AnalyticsSummaryDto> GetSummaryAsync(int managerId)
    {
        await EnsurePermissionAsync(managerId, "analytics.view", "Недостатньо прав для перегляду аналітики");

        var trips = (await _tripRepository.GetByManagerIdAsync(managerId))
            .Where(t => t.Status == TripStatus.Completed)
            .ToList();

        if (!trips.Any()) return new AnalyticsSummaryDto();

        var totalRevenue = trips.Sum(t => t.PaymentAmount);
        var totalProfit = trips.Sum(t => t.ExpectedProfit);
        var totalDistance = trips.Sum(t => t.DistanceKm);
        var totalTrips = trips.Count;
        var avgRating = trips.Where(t => t.Feedback?.Rating.HasValue == true).Select(t => (double)t.Feedback!.Rating!.Value).DefaultIfEmpty(0).Average();
        var fuelSpend = trips.Sum(t => t.EstimatedFuelCost);
        
        var completedWithFuel = trips.Where(t => t.ActualFuelConsumption.HasValue).ToList();
        var avgEfficiency = completedWithFuel.Any() 
            ? completedWithFuel.Average(t => t.ActualFuelConsumption!.Value) 
            : 0;

        return new AnalyticsSummaryDto
        {
            TotalRevenue = totalRevenue,
            TotalProfit = totalProfit,
            TotalDistance = totalDistance,
            TotalTrips = totalTrips,
            AverageRating = Math.Round(avgRating, 2),
            FuelSpend = fuelSpend,
            AvgFuelEfficiency = Math.Round(avgEfficiency, 2),
            ProfitMargin = totalRevenue > 0 ? Math.Round((totalProfit / totalRevenue) * 100, 2) : 0
        };
    }

    public async Task<IEnumerable<MonthlyTrendDto>> GetMonthlyTrendsAsync(int managerId, int months = 6)
    {
        await EnsurePermissionAsync(managerId, "analytics.view", "Недостатньо прав для перегляду аналітики");

        var trips = (await _tripRepository.GetByManagerIdAsync(managerId))
            .Where(t => t.Status == TripStatus.Completed && t.ActualArrival.HasValue)
            .ToList();

        var startDate = DateTime.UtcNow.AddMonths(-months);
        
        return trips
            .Where(t => t.ActualArrival >= startDate)
            .GroupBy(t => new { t.ActualArrival!.Value.Year, t.ActualArrival!.Value.Month })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g => new MonthlyTrendDto
            {
                Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                Revenue = g.Sum(t => t.PaymentAmount),
                Profit = g.Sum(t => t.ExpectedProfit),
                TripCount = g.Count()
            });
    }

    public async Task<IEnumerable<DriverPerformanceSummaryDto>> GetDriverRankingsAsync(int managerId)
    {
        await EnsurePermissionAsync(managerId, "analytics.view", "Недостатньо прав для перегляду аналітики");

        var drivers = await _userRepository.GetDriversByManagerIdAsync(managerId);
        var result = new List<DriverPerformanceSummaryDto>();

        foreach (var driver in drivers)
        {
            var driverTrips = (await _tripRepository.GetByDriverIdAsync(driver.Id))
                .Where(t => t.Status == TripStatus.Completed)
                .ToList();

            if (!driverTrips.Any()) continue;

            // ALGORITHM: Driver Efficiency Score
            // Factors: 
            // 1. Fuel Efficiency (Actual vs Vehicle Baseline) - 60%
            // 2. Ratings - 40%
            
            double fuelEfficiencyScore = 0;
            var tripsWithConsumption = driverTrips.Where(t => t.ActualFuelConsumption.HasValue && t.Vehicle != null).ToList();
            if (tripsWithConsumption.Any())
            {
                // Ratio of (Baseline / Actual). Higher is better. 1.0 means perfect matching.
                var efficiencyRatio = tripsWithConsumption.Average(t => (double)t.Vehicle!.FuelConsumption / t.ActualFuelConsumption!.Value);
                fuelEfficiencyScore = Math.Min(100, efficiencyRatio * 100);
            }
            else
            {
                fuelEfficiencyScore = 70; // Neutral score if no fuel data
            }

            var avgRating = driverTrips.Where(t => t.Feedback?.Rating.HasValue == true).Select(t => (double)t.Feedback!.Rating!.Value).DefaultIfEmpty(3).Average();
            var ratingScore = (avgRating / 5.0) * 100;

            var finalScore = (fuelEfficiencyScore * 0.6) + (ratingScore * 0.4);

            result.Add(new DriverPerformanceSummaryDto
            {
                DriverId = driver.Id,
                FullName = driver.FullName,
                EfficiencyScore = Math.Round(finalScore, 1),
                AvgRating = Math.Round(avgRating, 1),
                CompletedTrips = driverTrips.Count,
                TotalProfitGenerated = driverTrips.Sum(t => t.ExpectedProfit)
            });
        }

        return result.OrderByDescending(d => d.EfficiencyScore);
    }

    public async Task<IEnumerable<CargoTypeAnalyticsDto>> GetCargoAnalysisAsync(int managerId)
    {
        await EnsurePermissionAsync(managerId, "analytics.view", "Недостатньо прав для перегляду аналітики");

        var trips = (await _tripRepository.GetByManagerIdAsync(managerId))
            .Where(t => t.Status == TripStatus.Completed)
            .ToList();

        return trips
            .GroupBy(t => t.Cargo?.TypeId ?? 0)
            .Select(g => new CargoTypeAnalyticsDto
            {
                CargoType = ((CargoType)g.Key).ToString(),
                Count = g.Count(),
                TotalProfit = g.Sum(t => t.ExpectedProfit),
                AverageWeight = g.Average(t => t.CargoWeight)
            })
            .OrderByDescending(c => c.TotalProfit);
    }
}
