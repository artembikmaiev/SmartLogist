import { apiClient } from '@/lib/api/client';

export interface Manager {
    id: number;
    email: string;
    fullName: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
    activeDriversCount: number;
    permissions: string[];
}

export interface CreateManagerDto {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}

export interface UpdateManagerDto {
    fullName: string;
    phone?: string;
    isActive: boolean;
}

export const managersService = {
    async getAll(): Promise<Manager[]> {
        return await apiClient.get<Manager[]>('/admin/managers');
    },

    async getById(id: number): Promise<Manager> {
        return await apiClient.get<Manager>(`/admin/managers/${id}`);
    },

    async create(data: CreateManagerDto): Promise<Manager> {
        return await apiClient.post<Manager>('/admin/managers', data);
    },

    async update(id: number, data: UpdateManagerDto): Promise<Manager> {
        return await apiClient.put<Manager>(`/admin/managers/${id}`, data);
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/admin/managers/${id}`);
    }
};
