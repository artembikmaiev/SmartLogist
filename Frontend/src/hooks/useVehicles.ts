import { useState, useMemo, useCallback } from 'react';
import { vehiclesService } from '@/services/vehicles.service';
import { driversService } from '@/services/drivers.service';
import { Vehicle, VehicleStats } from '@/types/vehicle.types';
import { Driver } from '@/types/drivers.types';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import useResource from './useResource';

export function useVehicles() {
    const { success, error: notifyError } = useNotifications();
    const { user } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [stats, setStats] = useState<VehicleStats | null>(null);

    const permissions = useMemo(() => ({
        view: user?.permissions?.some(p => p.code === 'vehicles.view') ?? false,
        create: user?.permissions?.some(p => p.code === 'vehicles.create') ?? false,
        edit: user?.permissions?.some(p => p.code === 'vehicles.edit') ?? false,
        delete: user?.permissions?.some(p => p.code === 'vehicles.delete') ?? false,
    }), [user]);

    const fetchExtraData = useCallback(async () => {
        try {
            const [statsData, driversData] = await Promise.all([
                vehiclesService.getStats(),
                driversService.getAll()
            ]);
            setStats(statsData);
            setDrivers(driversData);
        } catch (err: any) {
            console.error('Failed to fetch extra vehicle data:', err);
        }
    }, []);

    const resource = useResource<Vehicle>({
        fetchFn: vehiclesService.getAll,
        deleteFn: vehiclesService.delete,
        onSuccess: () => fetchExtraData(),
        filterFn: (v, query) => {
            if (!query) return true;
            const search = query.toLowerCase();
            return v.model.toLowerCase().includes(search) ||
                v.licensePlate.toLowerCase().includes(search) ||
                (v.assignedDriverName && v.assignedDriverName.toLowerCase().includes(search));
        }
    });

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);

    const handleCreate = async (data: any) => {
        try {
            resource.setIsSubmitting(true);
            await vehiclesService.create(data);
            resource.setShowCreateModal(false);
            await resource.loadData(false);
            success('Транспорт успіщо додано');
            return true;
        } catch (err: any) {
            notifyError(err.message || 'Помилка створення транспорту');
            return false;
        } finally {
            resource.setIsSubmitting(false);
        }
    };

    const handleUpdate = async (id: number | string, data: any) => {
        try {
            resource.setIsSubmitting(true);
            await vehiclesService.update(id, data);
            resource.setShowEditModal(false);
            resource.setSelectedItem(null);
            await resource.loadData(false);
            success('Дані транспорту оновлено');
            return true;
        } catch (err: any) {
            notifyError(err.message || 'Помилка оновлення транспорту');
            return false;
        } finally {
            resource.setIsSubmitting(false);
        }
    };

    const handleAssignDriver = async (driverId: number) => {
        if (!resource.selectedItem) return false;
        try {
            resource.setIsSubmitting(true);
            await vehiclesService.assign(resource.selectedItem.id, { driverId, isPrimary: true });
            setIsAssignModalOpen(false);
            resource.setSelectedItem(null);
            await resource.loadData(false);
            success('Водія успішно призначено');
            return true;
        } catch (err: any) {
            notifyError(err.message || 'Помилка призначення водія');
            return false;
        } finally {
            resource.setIsSubmitting(false);
        }
    };

    const handleUnassignDriver = async () => {
        if (!resource.selectedItem) return false;
        try {
            resource.setIsSubmitting(true);
            await vehiclesService.unassign(resource.selectedItem.id, resource.selectedItem.assignedDriverId || 0);
            setIsUnassignModalOpen(false);
            resource.setSelectedItem(null);
            await resource.loadData(false);
            success('Водія відкріплено');
            return true;
        } catch (err: any) {
            notifyError(err.message || 'Помилка відкріплення водія');
            return false;
        } finally {
            resource.setIsSubmitting(false);
        }
    };

    return {
        ...resource,
        vehicles: resource.paginatedData,
        drivers,
        stats,
        permissions,
        modals: {
            add: {
                isOpen: resource.showCreateModal,
                open: () => resource.setShowCreateModal(true),
                close: () => resource.setShowCreateModal(false)
            },
            edit: {
                isOpen: resource.showEditModal,
                open: (v: Vehicle) => { resource.setSelectedItem(v); resource.setShowEditModal(true); },
                close: () => { resource.setShowEditModal(false); resource.setSelectedItem(null); }
            },
            delete: {
                isOpen: resource.showDeleteModal,
                open: (v: Vehicle) => { resource.setSelectedItem(v); resource.setShowDeleteModal(true); },
                close: () => { resource.setShowDeleteModal(false); resource.setSelectedItem(null); }
            },
            assign: {
                isOpen: isAssignModalOpen,
                open: (v: Vehicle) => { resource.setSelectedItem(v); setIsAssignModalOpen(true); },
                close: () => { setIsAssignModalOpen(false); resource.setSelectedItem(null); }
            },
            unassign: {
                isOpen: isUnassignModalOpen,
                open: (v: Vehicle) => { resource.setSelectedItem(v); setIsUnassignModalOpen(true); },
                close: () => { setIsUnassignModalOpen(false); resource.setSelectedItem(null); }
            }
        },
        selectedVehicle: resource.selectedItem,
        actions: {
            create: handleCreate,
            update: handleUpdate,
            delete: resource.handleDelete,
            assignDriver: handleAssignDriver,
            unassignDriver: handleUnassignDriver,
            refresh: resource.loadData
        }
    };
}
