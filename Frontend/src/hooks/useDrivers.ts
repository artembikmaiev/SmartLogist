import { useState, useMemo, useCallback } from 'react';
import { driversService } from '@/services/drivers.service';
import { requestsService, AdminRequest, RequestStatus, RequestType } from '@/services/requests.service';
import type { Driver, DriverStats } from '@/types/drivers.types';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import useResource from './useResource';

export function useDrivers() {
    const { user } = useAuth();
    const { success, error: notifyError } = useNotifications();
    const [stats, setStats] = useState<DriverStats | null>(null);
    const [pendingRequests, setPendingRequests] = useState<AdminRequest[]>([]);

    const permissions = useMemo(() => ({
        view: user?.permissions?.some(p => p.code === 'drivers.view') ?? false,
        create: user?.permissions?.some(p => p.code === 'drivers.create') ?? false,
        edit: user?.permissions?.some(p => p.code === 'drivers.edit') ?? false,
        delete: user?.permissions?.some(p => p.code === 'drivers.delete') ?? false,
    }), [user]);

    const fetchExtraData = useCallback(async () => {
        try {
            const [statsData, myRequests] = await Promise.all([
                driversService.getStats(),
                requestsService.getMy()
            ]);
            setStats(statsData);
            setPendingRequests(myRequests.filter(r =>
                r.status === RequestStatus.Pending &&
                r.type === RequestType.DriverCreation
            ));
        } catch (err: any) {
            console.error('Failed to fetch extra driver data:', err);
        }
    }, []);

    const resource = useResource<Driver>({
        fetchFn: driversService.getAll,
        deleteFn: driversService.delete,
        onSuccess: () => fetchExtraData(),
        filterFn: (driver, query) => {
            if (!query) return true;
            const search = query.toLowerCase();
            return driver.fullName.toLowerCase().includes(search) ||
                driver.email.toLowerCase().includes(search) ||
                (driver.phone && driver.phone.toLowerCase().includes(search)) ||
                (driver.assignedVehicle?.model.toLowerCase().includes(search)) ||
                (driver.assignedVehicle?.licensePlate.toLowerCase().includes(search));
        }
    });

    const handleCreate = async (data: any) => {
        try {
            resource.setIsSubmitting(true);
            await driversService.create(data);
            resource.setShowCreateModal(false);
            await resource.loadData(false);
            success('Водія успішно створено');
            return true;
        } catch (err: any) {
            notifyError(err.message || 'Помилка створення водія');
            return false;
        } finally {
            resource.setIsSubmitting(false);
        }
    };

    const handleUpdate = async (id: number | string, data: any) => {
        try {
            resource.setIsSubmitting(true);
            await driversService.update(id, data);
            resource.setShowEditModal(false);
            resource.setSelectedItem(null);
            await resource.loadData(false);
            success('Дані водія оновлено');
            return true;
        } catch (err: any) {
            notifyError(err.message || 'Помилка оновлення водія');
            return false;
        } finally {
            resource.setIsSubmitting(false);
        }
    };

    return {
        ...resource,
        drivers: resource.paginatedData,
        stats,
        pendingRequests,
        permissions,
        modals: {
            add: {
                isOpen: resource.showCreateModal,
                open: () => resource.setShowCreateModal(true),
                close: () => resource.setShowCreateModal(false)
            },
            edit: {
                isOpen: resource.showEditModal,
                open: (driver: Driver) => { resource.setSelectedItem(driver); resource.setShowEditModal(true); },
                close: () => { resource.setShowEditModal(false); resource.setSelectedItem(null); }
            },
            delete: {
                isOpen: resource.showDeleteModal,
                open: (driver: Driver) => { resource.setSelectedItem(driver); resource.setShowDeleteModal(true); },
                close: () => { resource.setShowDeleteModal(false); resource.setSelectedItem(null); }
            }
        },
        selectedDriver: resource.selectedItem,
        actions: {
            create: handleCreate,
            update: handleUpdate,
            delete: resource.handleDelete,
            refresh: resource.loadData
        }
    };
}
