using SmartLogist.Application.DTOs.Analytics;

namespace SmartLogist.Application.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsSummaryDto> GetSummaryAsync(int managerId);
    Task<IEnumerable<MonthlyTrendDto>> GetMonthlyTrendsAsync(int managerId, int months = 6);
    Task<IEnumerable<DriverPerformanceSummaryDto>> GetDriverRankingsAsync(int managerId);
    Task<IEnumerable<CargoTypeAnalyticsDto>> GetCargoAnalysisAsync(int managerId);
}
