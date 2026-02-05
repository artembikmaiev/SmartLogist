import { apiClient } from '@/lib/api/client';
import { Permission } from '@/types/common.types';

export const permissionsService = {
    // Get all available permissions
    async getAll(): Promise<Permission[]> {
        return await apiClient.get<Permission[]>('/admin/permissions');
    },

    // Get permissions for a specific manager
    async getManagerPermissions(managerId: number): Promise<Permission[]> {
        return await apiClient.get<Permission[]>(`/admin/managers/${managerId}/permissions`);
    },

    // Grant permission to manager
    async grantPermission(managerId: number, permissionId: number): Promise<void> {
        await apiClient.post<void>(`/admin/managers/${managerId}/permissions/${permissionId}`);
    },

    // Revoke permission from manager
    async revokePermission(managerId: number, permissionId: number): Promise<void> {
        await apiClient.delete<void>(`/admin/managers/${managerId}/permissions/${permissionId}`);
    },
};
