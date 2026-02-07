import { useState, useCallback, useMemo } from 'react';
import useResource from './useResource';
import { tripsService } from '@/services/trips.service';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Trip, DriverStatsSummary } from '@/types/trip.types';

export function useTrips(mode: 'manager' | 'driver' = 'manager') {
    const { success, error } = useNotifications();
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [driverStats, setDriverStats] = useState<DriverStatsSummary | null>(null);

    const permissions = useMemo(() => ({
        view: user?.permissions?.some(p => p.code === 'trips.view') ?? false,
        create: user?.permissions?.some(p => p.code === 'trips.create') ?? false,
        edit: user?.permissions?.some(p => p.code === 'trips.edit') ?? false,
        delete: user?.permissions?.some(p => p.code === 'trips.delete') ?? false,
    }), [user]);

    const fetchFn = useCallback(() => {
        return mode === 'manager'
            ? tripsService.getManagerTrips()
            : tripsService.getMyTrips();
    }, [mode]);

    const deleteFn = useCallback((id: number | string) => {
        return tripsService.deleteTrip(Number(id));
    }, []);

    const resource = useResource<Trip>({
        fetchFn,
        deleteFn,
        onSuccess: async () => {
            try {
                if (mode === 'manager') {
                    const statsData = await tripsService.getManagerStats();
                    setStats(statsData);
                } else {
                    const statsData = await tripsService.getDriverStats();
                    setDriverStats(statsData);
                }
            } catch (err) {
                console.error('Failed to fetch trip stats:', err);
            }
        }
    });

    const updateTripStatus = async (id: number, status: string, additionalData?: any) => {
        try {
            resource.setIsSubmitting(true);
            await tripsService.updateTrip(id, { status, ...additionalData });
            success('Статус оновлено');
            await resource.loadData(false);
        } catch (err: any) {
            error(err.message || 'Не вдалося оновити статус');
        } finally {
            resource.setIsSubmitting(false);
        }
    };

    const acceptTrip = async (id: number) => {
        try {
            await tripsService.acceptTrip(id);
            success('Рейс прийнято');
            await resource.loadData(false);
        } catch (err: any) {
            error(err.message || 'Не вдалося прийняти рейс');
        }
    };

    const declineTrip = async (id: number) => {
        try {
            await tripsService.declineTrip(id);
            success('Рейс відхилено');
            await resource.loadData(false);
        } catch (err: any) {
            error(err.message || 'Не вдалося відхилити рейс');
        }
    };

    return {
        ...resource,
        stats,
        driverStats,
        permissions,
        updateTripStatus,
        acceptTrip,
        declineTrip
    };
}
