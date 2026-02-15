// Цей файл містить функції для взаємодії з API управління водіями, включаючи отримання статистики та адміністрування.
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Driver, CreateDriverData, UpdateDriverData, DriverStats, DriverStatus } from '@/types/drivers.types';
import { BaseApiService } from './base.service';

class DriversService extends BaseApiService<Driver, CreateDriverData, UpdateDriverData> {
    constructor() {
        super(API_ENDPOINTS.DRIVERS.LIST);
    }

    getStats = async (): Promise<DriverStats> => {
        return apiClient.get<DriverStats>(`${this.endpoint}/stats`);
    };

    // Методи адміністратора
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
        return apiClient.post(`/admin/drivers/${driverId}/assign-manager`, { managerId });
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

    updateStatusFromDriver = async (status: DriverStatus): Promise<void> => {
        return apiClient.put(`${this.endpoint}/status`, { status });
    };

    updateProfileFromDriver = async (data: { fullName: string; phone?: string; licenseNumber?: string }): Promise<Driver> => {
        return apiClient.put<Driver>(`${this.endpoint}/profile`, data);
    };
}

export const driversService = new DriversService();
