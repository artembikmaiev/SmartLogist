// Сервіс для управління обліковими записами менеджерів та їхніми налаштуваннями доступу.
import { apiClient } from '@/lib/api/client';
import { BaseApiService } from './base.service';

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

class ManagersService extends BaseApiService<Manager, CreateManagerDto, UpdateManagerDto> {
    constructor() {
        super('/admin/managers');
    }
}

export const managersService = new ManagersService();
