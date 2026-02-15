// Сервіс для управління запитами на адміністрування та відстеження їх статусів виконання.
import { apiClient } from '@/lib/api/client';
import { BaseApiService } from './base.service';

export enum RequestType {
    DriverDeletion = 'DriverDeletion',
    DriverUpdate = 'DriverUpdate',
    VehicleDeletion = 'VehicleDeletion',
    VehicleUpdate = 'VehicleUpdate',
    DriverCreation = 'DriverCreation',
    VehicleCreation = 'VehicleCreation',
    Other = 'Other'
}

export enum RequestStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected'
}

export interface AdminRequest {
    id: number;
    type: RequestType;
    status: RequestStatus;
    requesterId: number;
    requesterName: string;
    targetId?: number;
    targetName: string;
    comment: string;
    adminResponse?: string;
    createdAt: string;
    processedAt?: string;
    processedBy?: string;
}

export interface ProcessRequestDto {
    approved: boolean;
    response?: string;
}

class RequestsService extends BaseApiService<AdminRequest> {
    constructor() {
        super('/admin/requests');
    }

    async getPending(): Promise<AdminRequest[]> {
        return apiClient.get<AdminRequest[]>(`${this.endpoint}/pending`);
    }

    async getMy(): Promise<AdminRequest[]> {
        return apiClient.get<AdminRequest[]>(`${this.endpoint}/my`);
    }

    async processRequest(id: number, dto: ProcessRequestDto): Promise<void> {
        return apiClient.post(`${this.endpoint}/${id}/process`, dto);
    }

    async clearProcessed(): Promise<void> {
        return apiClient.delete(`${this.endpoint}/clear-processed`);
    }
}

export const requestsService = new RequestsService();
