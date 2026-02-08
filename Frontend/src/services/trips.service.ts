import { BaseApiService } from './base.service';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Trip, CreateTripDto, UpdateTripDto } from '@/types/trip.types';
import { apiClient } from '@/lib/api/client';

class TripsService extends BaseApiService<Trip, CreateTripDto, UpdateTripDto> {
    constructor() {
        super(API_ENDPOINTS.TRIPS.BASE);
    }

    getMyTrips = async (): Promise<Trip[]> => {
        return this.get(API_ENDPOINTS.TRIPS.MY);
    };

    getDriverStats = async (): Promise<DriverStatsSummary> => {
        return this.get(API_ENDPOINTS.TRIPS.DRIVER_STATS);
    };

    acceptTrip = async (id: number): Promise<void> => {
        return this.post(API_ENDPOINTS.TRIPS.ACCEPT(id), {});
    };

    declineTrip = async (id: number): Promise<void> => {
        return this.post(API_ENDPOINTS.TRIPS.DECLINE(id), {});
    };

    createTrip = async (dto: CreateTripDto): Promise<Trip> => {
        return this.post(API_ENDPOINTS.TRIPS.BASE, dto);
    };

    updateTrip = async (id: number, dto: UpdateTripDto): Promise<Trip> => {
        return this.put(`${API_ENDPOINTS.TRIPS.BASE}/${id}`, dto);
    };

    getManagerTrips = async (): Promise<Trip[]> => {
        return this.get(API_ENDPOINTS.TRIPS.MANAGER);
    };

    getManagerStats = async (): Promise<any> => {
        return this.get(API_ENDPOINTS.TRIPS.MANAGER_STATS);
    };

    deleteTrip = async (id: number): Promise<void> => {
        return this.delete(id);
    };
}

import type { DriverStatsSummary } from '@/types/trip.types';

export const tripsService = new TripsService();
