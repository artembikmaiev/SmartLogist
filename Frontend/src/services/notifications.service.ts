import { apiClient } from '@/lib/api/client';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
}

export const notificationsService = {
    async getAll(): Promise<Notification[]> {
        return apiClient.get<Notification[]>('/notifications');
    },

    async getUnreadCount(): Promise<number> {
        return apiClient.get<number>('/notifications/unread-count');
    },

    async markAsRead(id: number): Promise<void> {
        return apiClient.post(`/notifications/${id}/read`);
    },

    async markAllAsRead(): Promise<void> {
        return apiClient.post('/notifications/read-all');
    },

    async clearAll(): Promise<void> {
        return apiClient.delete('/notifications/clear');
    }
};
