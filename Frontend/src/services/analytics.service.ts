import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
    AnalyticsSummary,
    MonthlyTrend,
    DriverPerformance,
    CargoTypeAnalytics
} from '@/types/analytics.types';

export const analyticsService = {
    async getSummary(): Promise<AnalyticsSummary> {
        return await apiClient.get<AnalyticsSummary>(API_ENDPOINTS.ANALYTICS.SUMMARY);
    },

    async getMonthlyTrends(months: number = 6): Promise<MonthlyTrend[]> {
        return await apiClient.get<MonthlyTrend[]>(`${API_ENDPOINTS.ANALYTICS.TRENDS}?months=${months}`);
    },

    async getDriverRankings(): Promise<DriverPerformance[]> {
        return await apiClient.get<DriverPerformance[]>(API_ENDPOINTS.ANALYTICS.DRIVERS);
    },

    async getCargoAnalysis(): Promise<CargoTypeAnalytics[]> {
        return await apiClient.get<CargoTypeAnalytics[]>(API_ENDPOINTS.ANALYTICS.CARGO);
    }
};
