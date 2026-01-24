import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Driver, CreateDriverData, UpdateDriverData, DriverStats } from '@/types/drivers.types';

export const driversService = {
    async getAll(): Promise<Driver[]> {
        return apiClient.get<Driver[]>(API_ENDPOINTS.DRIVERS.LIST);
    },

    async getById(id: number): Promise<Driver> {
        return apiClient.get<Driver>(`${API_ENDPOINTS.DRIVERS.LIST}/${id}`);
    },

    async create(data: CreateDriverData): Promise<Driver> {
        return apiClient.post<Driver>(API_ENDPOINTS.DRIVERS.LIST, data);
    },

    async update(id: number, data: UpdateDriverData): Promise<Driver> {
        return apiClient.put<Driver>(`${API_ENDPOINTS.DRIVERS.LIST}/${id}`, data);
    },

    async delete(id: number): Promise<void> {
        return apiClient.delete<void>(`${API_ENDPOINTS.DRIVERS.LIST}/${id}`);
    },

    async getStats(): Promise<DriverStats> {
        return apiClient.get<DriverStats>(`${API_ENDPOINTS.DRIVERS.LIST}/stats`);
    }
};
