import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Driver, CreateDriverDto, UpdateDriverDto } from '@/types/driver.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common.types';

export const driversService = {
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Driver>> {
        const queryString = params
            ? `?page=${params.page}&limit=${params.limit}`
            : '';

        const response = await apiClient.get<ApiResponse<PaginatedResponse<Driver>>>(
            `${API_ENDPOINTS.DRIVERS.BASE}${queryString}`
        );
        return response.data;
    },

    async getById(id: string): Promise<Driver> {
        const response = await apiClient.get<ApiResponse<Driver>>(
            API_ENDPOINTS.DRIVERS.BY_ID(id)
        );
        return response.data;
    },

    async create(data: CreateDriverDto): Promise<Driver> {
        const response = await apiClient.post<ApiResponse<Driver>>(
            API_ENDPOINTS.DRIVERS.BASE,
            data
        );
        return response.data;
    },

    async update(id: string, data: UpdateDriverDto): Promise<Driver> {
        const response = await apiClient.put<ApiResponse<Driver>>(
            API_ENDPOINTS.DRIVERS.BY_ID(id),
            data
        );
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.DRIVERS.BY_ID(id));
    },

    async getStats(): Promise<any> {
        const response = await apiClient.get<ApiResponse<any>>(
            API_ENDPOINTS.DRIVERS.STATS
        );
        return response.data;
    },
};
