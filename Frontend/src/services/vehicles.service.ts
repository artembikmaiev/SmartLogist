import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '@/types/vehicle.types';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common.types';

export const vehiclesService = {
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Vehicle>> {
        const queryString = params
            ? `?page=${params.page}&limit=${params.limit}`
            : '';

        const response = await apiClient.get<ApiResponse<PaginatedResponse<Vehicle>>>(
            `${API_ENDPOINTS.VEHICLES.BASE}${queryString}`
        );
        return response.data;
    },

    async getById(id: string): Promise<Vehicle> {
        const response = await apiClient.get<ApiResponse<Vehicle>>(
            API_ENDPOINTS.VEHICLES.BY_ID(id)
        );
        return response.data;
    },

    async create(data: CreateVehicleDto): Promise<Vehicle> {
        const response = await apiClient.post<ApiResponse<Vehicle>>(
            API_ENDPOINTS.VEHICLES.BASE,
            data
        );
        return response.data;
    },

    async update(id: string, data: UpdateVehicleDto): Promise<Vehicle> {
        const response = await apiClient.put<ApiResponse<Vehicle>>(
            API_ENDPOINTS.VEHICLES.BY_ID(id),
            data
        );
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.VEHICLES.BY_ID(id));
    },

    async getStats(): Promise<any> {
        const response = await apiClient.get<ApiResponse<any>>(
            API_ENDPOINTS.VEHICLES.STATS
        );
        return response.data;
    },
};
