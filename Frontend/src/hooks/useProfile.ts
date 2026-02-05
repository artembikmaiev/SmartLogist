import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { activitiesService } from '@/services/activities.service';
import { driversService } from '@/services/drivers.service';
import { authService } from '@/services/auth.service';
import { useNotifications } from '@/contexts/NotificationContext';
import type { ActivityLog } from '@/types/activity.types';
import type { DriverStatus } from '@/types/drivers.types';

export function useProfile(role: 'driver' | 'manager') {
    const { user, refreshUser } = useAuth();
    const { success, error } = useNotifications();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);

    const fetchActivities = useCallback(async () => {
        try {
            const data = await activitiesService.getRecent(3);
            setActivities(data);
        } catch (err) {
            console.error('Failed to fetch activities:', err);
        } finally {
            setIsLoadingActivities(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchActivities();
        }
    }, [user, fetchActivities]);

    const updateProfile = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (role === 'driver') {
                await driversService.updateProfileFromDriver(data);
            } else {
                await authService.updateProfile(data);
            }
            await refreshUser();
            setIsEditing(false);
            success('Профіль оновлено');
            fetchActivities();
        } catch (err: any) {
            error(err.message || 'Помилка при оновленні профілю');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateStatus = async (status: DriverStatus) => {
        setIsSubmitting(true);
        try {
            await driversService.updateStatusFromDriver(status);
            await refreshUser();
            success('Статус змінено');
            fetchActivities();
        } catch (err: any) {
            error(err.message || 'Не вдалося оновити статус');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        user,
        isEditing,
        setIsEditing,
        isSubmitting,
        activities,
        isLoadingActivities,
        updateProfile,
        updateStatus,
        fetchActivities
    };
}
