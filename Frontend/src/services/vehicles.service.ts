// Сервіс для управління даними про транспортні засоби, їх доступність та технічний стан.
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto, AssignVehicleDto, VehicleStats } from '@/types/vehicle.types';
import { BaseApiService } from './base.service';

class VehiclesService extends BaseApiService<Vehicle, CreateVehicleDto, UpdateVehicleDto> {
    constructor() {
        super(API_ENDPOINTS.VEHICLES.LIST);
    }

    assign = async (id: number | string, data: AssignVehicleDto): Promise<void> => {
        return apiClient.post<void>(API_ENDPOINTS.VEHICLES.ASSIGN(id), data);
    };

    unassign = async (id: number | string, driverId: number | string): Promise<void> => {
        return apiClient.post<void>(API_ENDPOINTS.VEHICLES.UNASSIGN(id, driverId), {});
    };

    getStats = async (): Promise<VehicleStats> => {
        return apiClient.get<VehicleStats>(API_ENDPOINTS.VEHICLES.STATS);
    };

    performMaintenance = async (id: number | string): Promise<void> => {
        return apiClient.post<void>(`${API_ENDPOINTS.VEHICLES.LIST}/${id}/maintenance`, {});
    };

    async getAllAdmin(): Promise<Vehicle[]> {
        return apiClient.get<Vehicle[]>('/admin/drivers/vehicles');
    }

    async createAdmin(data: CreateVehicleDto): Promise<Vehicle> {
        return apiClient.post<Vehicle>('/admin/drivers/vehicles', data);
    }

    async updateAdmin(id: number | string, data: UpdateVehicleDto): Promise<Vehicle> {
        return apiClient.put<Vehicle>(`/admin/drivers/vehicles/${id}`, data);
    }

    async deleteAdmin(id: number | string): Promise<void> {
        return apiClient.delete<void>(`/admin/drivers/vehicles/${id}`);
    }
}

export const vehiclesService = new VehiclesService();
