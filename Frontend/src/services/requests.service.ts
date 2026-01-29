import { apiClient } from '@/lib/api/client';

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

export const requestsService = {
    async getAll(): Promise<AdminRequest[]> {
        return apiClient.get<AdminRequest[]>('/admin/requests');
    },

    async getPending(): Promise<AdminRequest[]> {
        return apiClient.get<AdminRequest[]>('/admin/requests/pending');
    },

    async getMy(): Promise<AdminRequest[]> {
        return apiClient.get<AdminRequest[]>('/admin/requests/my');
    },

    async processRequest(id: number, dto: ProcessRequestDto): Promise<void> {
        return apiClient.post(`/admin/requests/${id}/process`, dto);
    },

    async clearProcessed(): Promise<void> {
        return apiClient.delete('/admin/requests/clear-processed');
    }
};
