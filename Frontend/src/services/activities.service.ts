import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';
import { ActivityLog } from '@/types/activity.types';

export const activitiesService = {
    async getRecent(count: number = 10): Promise<ActivityLog[]> {
        return await apiClient.get<ActivityLog[]>(
            `${API_ENDPOINTS.ACTIVITIES.RECENT}?count=${count}`
        );
    }
};
