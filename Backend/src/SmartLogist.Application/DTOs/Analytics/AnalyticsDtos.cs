// Об'єкти передачі даних для аналітичних звітів та статистики виконання рейсів.
namespace SmartLogist.Application.DTOs.Analytics;

public class AnalyticsSummaryDto
{
    public decimal TotalRevenue { get; set; }
    public decimal TotalProfit { get; set; }
    public decimal TotalDistance { get; set; }
    public int TotalTrips { get; set; }
    public double AverageRating { get; set; }
    public decimal FuelSpend { get; set; }
    public double AvgFuelEfficiency { get; set; } // L/100km
    public decimal ProfitMargin { get; set; }
}

public class MonthlyTrendDto
{
    public string Month { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public decimal Profit { get; set; }
    public int TripCount { get; set; }
}

public class DriverPerformanceSummaryDto
{
    public int DriverId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public double EfficiencyScore { get; set; } // 0-100
    public double AvgRating { get; set; }
    public int CompletedTrips { get; set; }
    public decimal TotalProfitGenerated { get; set; }
}

public class CargoTypeAnalyticsDto
{
    public string CargoType { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalProfit { get; set; }
    public double AverageWeight { get; set; }
}
