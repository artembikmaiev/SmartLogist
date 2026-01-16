import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { AnalyticsStats, FuelConsumptionData, CostAnalysisData } from '@/types/analytics.types';
import type { ApiResponse } from '@/types/common.types';

export const analyticsService = {
    async getStats(): Promise<AnalyticsStats> {
        const response = await apiClient.get<ApiResponse<AnalyticsStats>>(
            API_ENDPOINTS.ANALYTICS.STATS
        );
        return response.data;
    },

    async getFuelConsumption(): Promise<FuelConsumptionData[]> {
        const response = await apiClient.get<ApiResponse<FuelConsumptionData[]>>(
            API_ENDPOINTS.ANALYTICS.FUEL
        );
        return response.data;
    },

    async getCostAnalysis(): Promise<CostAnalysisData[]> {
        const response = await apiClient.get<ApiResponse<CostAnalysisData[]>>(
            API_ENDPOINTS.ANALYTICS.COSTS
        );
        return response.data;
    },
};
