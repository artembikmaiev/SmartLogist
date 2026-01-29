import { BaseApiService } from './base.service';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Trip, CreateTripDto, UpdateTripDto } from '@/types/trip.types';
import { apiClient } from '@/lib/api/client';

class TripsService extends BaseApiService<Trip, CreateTripDto, UpdateTripDto> {
    constructor() {
        super(API_ENDPOINTS.TRIPS.BASE);
    }

    // Overriding getAll to support current pagination logic if needed
    // In this project some services return T[] and some PaginatedResponse
    // For now we preserve the specific implementation for trips
    async getAllPaginated(params?: { page: number; limit: number }): Promise<any> {
        const queryString = params
            ? `?page=${params.page}&limit=${params.limit}`
            : '';

        return apiClient.get(`${this.endpoint}${queryString}`);
    }

    async getStats(): Promise<any> {
        return apiClient.get(API_ENDPOINTS.TRIPS.STATS);
    }
}

export const tripsService = new TripsService();
