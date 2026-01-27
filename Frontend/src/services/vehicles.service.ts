import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto, AssignVehicleDto, VehicleStats } from '@/types/vehicle.types';

export const vehiclesService = {
    async getAll(): Promise<Vehicle[]> {
        return apiClient.get<Vehicle[]>(API_ENDPOINTS.VEHICLES.LIST);
    },

    async getById(id: number | string): Promise<Vehicle> {
        return apiClient.get<Vehicle>(API_ENDPOINTS.VEHICLES.BY_ID(id));
    },

    async create(data: CreateVehicleDto): Promise<Vehicle> {
        return apiClient.post<Vehicle>(API_ENDPOINTS.VEHICLES.LIST, data);
    },

    async update(id: number | string, data: UpdateVehicleDto): Promise<Vehicle> {
        return apiClient.put<Vehicle>(API_ENDPOINTS.VEHICLES.BY_ID(id), data);
    },

    async delete(id: number | string): Promise<void> {
        return apiClient.delete<void>(API_ENDPOINTS.VEHICLES.BY_ID(id));
    },

    async assign(id: number | string, data: AssignVehicleDto): Promise<void> {
        return apiClient.post<void>(API_ENDPOINTS.VEHICLES.ASSIGN(id), data);
    },

    async unassign(id: number | string, driverId: number | string): Promise<void> {
        return apiClient.post<void>(API_ENDPOINTS.VEHICLES.UNASSIGN(id, driverId), {});
    },

    async getStats(): Promise<VehicleStats> {
        return apiClient.get<VehicleStats>(API_ENDPOINTS.VEHICLES.STATS);
    },

    async getAllAdmin(): Promise<Vehicle[]> {
        return apiClient.get<Vehicle[]>('/admin/drivers/vehicles');
    }
};
