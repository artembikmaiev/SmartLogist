import { BaseApiService } from './base.service';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Trip, CreateTripDto, UpdateTripDto } from '@/types/trip.types';
import { apiClient } from '@/lib/api/client';

class TripsService extends BaseApiService<Trip, CreateTripDto, UpdateTripDto> {
    constructor() {
        super(API_ENDPOINTS.TRIPS.BASE);
    }

    async getMyTrips(): Promise<Trip[]> {
        return apiClient.get(API_ENDPOINTS.TRIPS.MY);
    }

    async getDriverStats(): Promise<DriverStatsSummary> {
        return apiClient.get(API_ENDPOINTS.TRIPS.DRIVER_STATS);
    }

    async acceptTrip(id: number): Promise<void> {
        return apiClient.post(API_ENDPOINTS.TRIPS.ACCEPT(id));
    }

    async declineTrip(id: number): Promise<void> {
        return apiClient.post(API_ENDPOINTS.TRIPS.DECLINE(id));
    }
}

import type { DriverStatsSummary } from '@/types/trip.types';

export const tripsService = new TripsService();
