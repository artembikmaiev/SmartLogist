import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Driver, CreateDriverData, UpdateDriverData, DriverStats } from '@/types/drivers.types';
import { BaseApiService } from './base.service';

class DriversService extends BaseApiService<Driver, CreateDriverData, UpdateDriverData> {
    constructor() {
        super(API_ENDPOINTS.DRIVERS.LIST);
    }

    getStats = async (): Promise<DriverStats> => {
        return apiClient.get<DriverStats>(`${this.endpoint}/stats`);
    };

    // Admin methods
    getAllAdmin = async (): Promise<Driver[]> => {
        return apiClient.get<Driver[]>('/admin/drivers');
    };

    createAdmin = async (data: CreateDriverData): Promise<Driver> => {
        return apiClient.post<Driver>('/admin/drivers', data);
    };

    updateAdmin = async (id: number, data: UpdateDriverData): Promise<Driver> => {
        return apiClient.put<Driver>(`/admin/drivers/${id}`, data);
    };

    deleteAdmin = async (id: number): Promise<void> => {
        return apiClient.delete(`/admin/drivers/${id}`);
    };

    assignManager = async (driverId: number, managerId: number | null): Promise<void> => {
        return apiClient.post(`/admin/drivers/${driverId}/assign-manager`, managerId);
    };

    getStatsAdmin = async (): Promise<DriverStats> => {
        return apiClient.get<DriverStats>('/admin/drivers/stats');
    };

    assignVehicle = async (driverId: number, vehicleId: number): Promise<void> => {
        return apiClient.post(`/admin/drivers/${driverId}/assign-vehicle`, vehicleId);
    };

    unassignVehicle = async (driverId: number, vehicleId: number): Promise<void> => {
        return apiClient.post(`/admin/drivers/${driverId}/unassign-vehicle`, vehicleId);
    };
}

export const driversService = new DriversService();
