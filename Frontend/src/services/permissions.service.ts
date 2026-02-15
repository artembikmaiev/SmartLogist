// Цей сервіс відповідає за управління дозволами менеджерів у системі, включаючи їх отримання та зміну.
import { apiClient } from '@/lib/api/client';
import type { Permission } from '@/types/common.types';

export type { Permission };

export const permissionsService = {
    // Отримати всі доступні дозволи
    async getAll(): Promise<Permission[]> {
        return await apiClient.get<Permission[]>('/admin/permissions');
    },

    // Отримати дозволи для конкретного менеджера
    async getManagerPermissions(managerId: number): Promise<Permission[]> {
        return await apiClient.get<Permission[]>(`/admin/managers/${managerId}/permissions`);
    },

    // Надати дозвіл менеджеру
    async grantPermission(managerId: number, permissionId: number): Promise<void> {
        await apiClient.post<void>(`/admin/managers/${managerId}/permissions/${permissionId}`);
    },

    // Відкликати дозвіл у менеджера
    async revokePermission(managerId: number, permissionId: number): Promise<void> {
        await apiClient.delete<void>(`/admin/managers/${managerId}/permissions/${permissionId}`);
    },
};
