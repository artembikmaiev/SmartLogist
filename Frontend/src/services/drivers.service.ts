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
    },

    // Admin methods
    async getAllAdmin(): Promise<Driver[]> {
        return apiClient.get<Driver[]>('/admin/drivers');
    },

    async createAdmin(data: CreateDriverData): Promise<Driver> {
        return apiClient.post<Driver>('/admin/drivers', data);
    },

    async updateAdmin(id: number, data: UpdateDriverData): Promise<Driver> {
        return apiClient.put<Driver>(`/admin/drivers/${id}`, data);
    },

    async deleteAdmin(id: number): Promise<void> {
        return apiClient.delete(`/admin/drivers/${id}`);
    },

    async assignManager(driverId: number, managerId: number | null): Promise<void> {
        return apiClient.post(`/admin/drivers/${driverId}/assign-manager`, managerId);
    },

    async getStatsAdmin(): Promise<DriverStats> {
        return apiClient.get<DriverStats>('/admin/drivers/stats');
    },

    async assignVehicle(driverId: number, vehicleId: number): Promise<void> {
        return apiClient.post(`/admin/drivers/${driverId}/assign-vehicle`, vehicleId);
    },

    async unassignVehicle(driverId: number, vehicleId: number): Promise<void> {
        return apiClient.post(`/admin/drivers/${driverId}/unassign-vehicle`, vehicleId);
    }
};
