import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Trip, CreateTripDto, UpdateTripDto } from '@/types/trip.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common.types';

export const tripsService = {
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Trip>> {
        const queryString = params
            ? `?page=${params.page}&limit=${params.limit}`
            : '';

        const response = await apiClient.get<ApiResponse<PaginatedResponse<Trip>>>(
            `${API_ENDPOINTS.TRIPS.BASE}${queryString}`
        );
        return response.data;
    },

    async getById(id: string): Promise<Trip> {
        const response = await apiClient.get<ApiResponse<Trip>>(
            API_ENDPOINTS.TRIPS.BY_ID(id)
        );
        return response.data;
    },

    async create(data: CreateTripDto): Promise<Trip> {
        const response = await apiClient.post<ApiResponse<Trip>>(
            API_ENDPOINTS.TRIPS.BASE,
            data
        );
        return response.data;
    },

    async update(id: string, data: UpdateTripDto): Promise<Trip> {
        const response = await apiClient.put<ApiResponse<Trip>>(
            API_ENDPOINTS.TRIPS.BY_ID(id),
            data
        );
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.TRIPS.BY_ID(id));
    },

    async getStats(): Promise<any> {
        const response = await apiClient.get<ApiResponse<any>>(
            API_ENDPOINTS.TRIPS.STATS
        );
        return response.data;
    },
};
