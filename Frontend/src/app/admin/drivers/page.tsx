'use client';

import { useState, useEffect } from 'react';
import { UserCog, Link as LinkIcon, Edit, Trash2, AlertCircle, Truck, X, Check } from 'lucide-react';
import { driversService } from '@/services/drivers.service';
import { managersService, Manager } from '@/services/managers.service';
import { vehiclesService } from '@/services/vehicles.service';
import { Driver, DriverStats } from '@/types/drivers.types';
import { Vehicle } from '@/types/vehicle.types';
import useResource from '@/hooks/useResource';
import DataTable, { Column } from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';
import FilterBar from '@/components/ui/FilterBar';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import StatusIndicator from '@/components/ui/StatusIndicator';
import DriverForm from '@/components/drivers/DriverForm';
import StatCard from '@/components/ui/StatCard';
import { useNotifications } from '@/contexts/NotificationContext';

export default function AdminDriversPage() {
    const [managerFilter, setManagerFilter] = useState<string>('');
    const [managers, setManagers] = useState<Manager[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [stats, setStats] = useState<DriverStats | null>(null);
    const [isActionSubmitting, setIsActionSubmitting] = useState(false);
    const { success, error } = useNotifications();

    // Extra modals for Admin specific actions
    const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
    const [showAssignVehicleModal, setShowAssignVehicleModal] = useState(false);
    const [showUnassignVehicleModal, setShowUnassignVehicleModal] = useState(false);
    const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

    const {
        filteredData: drivers,
        isLoading,
        searchQuery,
        setSearchQuery,
        isSubmitting,
        setIsSubmitting,
        showCreateModal,
        setShowCreateModal,
        showEditModal,
        setShowEditModal,
        showDeleteModal,
        setShowDeleteModal,
        selectedItem: selectedDriver,
        loadData,
        handleCreateOpen,
        handleEditOpen,
        handleDeleteOpen,
        handleDelete,
        closeModals,
        setSelectedItem,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        pageSize,
        setPageSize,
        paginatedData
    } = useResource<Driver>({
        fetchFn: driversService.getAllAdmin,
        deleteFn: driversService.deleteAdmin as (id: string | number) => Promise<void>,
        filterFn: (driver, query) => {
            const matchesSearch =
                driver.fullName.toLowerCase().includes(query.toLowerCase()) ||
                driver.email.toLowerCase().includes(query.toLowerCase()) ||
                driver.phone?.toLowerCase().includes(query.toLowerCase()) ||
                driver.licenseNumber?.toLowerCase().includes(query.toLowerCase());

            const matchesManager = !managerFilter ||
                (managerFilter === 'unassigned' ? !driver.managerId : driver.managerId?.toString() === managerFilter);

            return !!(matchesSearch && matchesManager);
        }
    });

    useEffect(() => {
        const loadAllAdminData = async () => {
            try {
                const [managersData, vehiclesData, statsData] = await Promise.all([
                    managersService.getAll(),
                    vehiclesService.getAllAdmin(),
                    driversService.getStatsAdmin()
                ]);
                setManagers(managersData);
                setVehicles(vehiclesData);
                setStats(statsData);
            } catch (err) {
                console.error('Error loading extra admin data:', err);
            }
        };
        loadAllAdminData();
    }, []);

    const handleFormSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            if (showCreateModal) {
                await driversService.createAdmin(data);
            } else if (showEditModal && selectedDriver) {
                await driversService.updateAdmin(selectedDriver.id, data);
            }
            closeAllModals();
            await loadData(false);
            success(showCreateModal ? 'Водія успішно додано' : 'Дані водія оновлено');
            return true;
        } catch (err: any) {
            error(err.message || 'Помилка при збереженні');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignManager = async () => {
        if (!selectedDriver) return;
        try {
            setIsActionSubmitting(true);
            await driversService.assignManager(selectedDriver.id, selectedManagerId);
            closeAllModals();
            await loadData(false);
            success('Менеджера успішно призначено');
        } catch (err: any) {
            error(err.message || 'Помилка при призначенні менеджера');
        } finally {
            setIsActionSubmitting(false);
        }
    };

    const handleAssignVehicle = async () => {
        if (!selectedDriver || !selectedVehicleId) return;
        try {
            setIsActionSubmitting(true);
            await driversService.assignVehicle(selectedDriver.id, selectedVehicleId);
            closeAllModals();
            await loadData(false);
            success('Транспорт успішно призначено');
        } catch (err: any) {
            error(err.message || 'Помилка при призначенні транспорту');
        } finally {
            setIsActionSubmitting(false);
        }
    };

    const handleUnassignVehicle = async () => {
        if (!selectedDriver || !selectedDriver.assignedVehicle) return;
        try {
            setIsActionSubmitting(true);
            await driversService.unassignVehicle(selectedDriver.id, selectedDriver.assignedVehicle.vehicleId);
            closeAllModals();
            await loadData(false);
            success('Транспорт успішно відкріплено');
        } catch (err: any) {
            error(err.message || 'Помилка при відкріпленні транспорту');
        } finally {
            setIsActionSubmitting(false);
        }
    };

    const closeAllModals = () => {
        closeModals();
        setShowAssignManagerModal(false);
        setShowAssignVehicleModal(false);
        setShowUnassignVehicleModal(false);
        setSelectedManagerId(null);
        setSelectedVehicleId(null);
    };

    const columns: Column<Driver>[] = [
        {
            header: 'Водій',
            key: 'fullName',
            render: (driver) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-xs">
                            {driver.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{driver.fullName}</p>
                        <p className="text-xs text-slate-500">{driver.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Менеджер',
            key: 'managerName',
            render: (driver) => (
                driver.managerName ? (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserCog className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-medium text-slate-900">{driver.managerName}</span>
                    </div>
                ) : (
                    <span className="text-sm text-orange-600 font-medium">Не призначено</span>
                )
            )
        },
        {
            header: 'Транспорт',
            key: 'assignedVehicle',
            render: (driver) => (
                driver.assignedVehicle ? (
                    <div className="flex items-center justify-between group">
                        <div>
                            <p className="text-sm font-medium text-slate-900">{driver.assignedVehicle.model}</p>
                            <p className="text-xs text-slate-500">{driver.assignedVehicle.licensePlate}</p>
                        </div>
                        <button
                            onClick={() => { setSelectedItem(driver); setShowUnassignVehicleModal(true); }}
                            className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Відкріпити"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => { setSelectedItem(driver); setSelectedVehicleId(null); setShowAssignVehicleModal(true); }}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                        <Truck className="w-4 h-4" />
                        Видати авто
                    </button>
                )
            )
        },
        {
            header: 'Статус',
            key: 'status',
            render: (driver) => (
                <div className="flex flex-col gap-1">
                    <StatusIndicator status={driver.status as any} type="driver" />
                    {driver.hasPendingDeletion && (
                        <Badge variant="warning" pulse>
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Запит на видалення
                        </Badge>
                    )}
                    {driver.hasPendingUpdate && <Badge variant="info" pulse>Запит на редагування</Badge>}
                    {!driver.isActive && <Badge variant="error">Деактивовано</Badge>}
                </div>
            )
        },
        {
            header: 'Дії',
            key: 'actions',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (driver) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => { setSelectedItem(driver); setSelectedManagerId(driver.managerId || null); setShowAssignManagerModal(true); }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Призначити менеджера"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEditOpen(driver)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteOpen(driver)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" disabled={driver.hasPendingDeletion}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <PageHeader
                title="Управління водіями"
                description="Прив'язка водіїв до менеджерів та загальне управління"
                onRefresh={() => loadData()}
                primaryAction={{
                    label: 'Додати водія',
                    onClick: handleCreateOpen
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Всього водіїв" value={stats?.totalDrivers || 0} color="purple" icon={UserCog} />
                <StatCard title="Вільні" value={stats?.availableDrivers || 0} color="green" icon={Check} />
                <StatCard title="На рейсі" value={stats?.onTripDrivers || 0} color="blue" icon={Truck} />
                <StatCard title="Офлайн" value={stats?.offlineDrivers || 0} color="blue" icon={X} />
            </div>

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Пошук за ім'ям, email, тел. або ліцензією..."
            >
                <select
                    value={managerFilter}
                    onChange={(e) => setManagerFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-slate-900 font-medium"
                >
                    <option value="">Всі менеджери</option>
                    {managers.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                    <option value="unassigned">Без менеджера</option>
                </select>
            </FilterBar>

            <DataTable
                data={drivers}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="Водіїв не знайдено"
                pagination={{
                    currentPage,
                    totalPages,
                    totalItems,
                    pageSize,
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                    label: 'водіїв'
                }}
            />

            {/* Modals */}
            <Modal isOpen={showCreateModal || showEditModal} onClose={closeAllModals} title={showCreateModal ? 'Додати водія' : 'Редагувати водія'}>
                <DriverForm driver={selectedDriver || undefined} onSubmit={handleFormSubmit} onCancel={closeAllModals} isAdmin />
            </Modal>

            <Modal isOpen={showDeleteModal} onClose={closeAllModals} title="Видалити водія?">
                <div className="text-center p-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-slate-600 mb-8">Ви впевнені що хочете видалити водія <strong>{selectedDriver?.fullName}</strong>?</p>
                    <div className="flex gap-3">
                        <button onClick={closeAllModals} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl font-semibold">Скасувати</button>
                        <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold disabled:opacity-50">
                            {isSubmitting ? 'Видалення...' : 'Так, видалити'}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={showAssignManagerModal} onClose={closeAllModals} title="Призначити менеджера">
                <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-4">Виберіть менеджера для водія <span className="font-bold">{selectedDriver?.fullName}</span></p>
                    <select
                        value={selectedManagerId === null ? "0" : selectedManagerId}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSelectedManagerId(val === "0" ? null : Number(val));
                        }}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                    >
                        <option value="0">-- Без менеджера --</option>
                        {managers.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                    </select>
                </div>
                <div className="flex gap-3">
                    <button onClick={closeAllModals} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl">Скасувати</button>
                    <button onClick={handleAssignManager} disabled={isActionSubmitting} className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl">
                        {isActionSubmitting ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>
            </Modal>

            {/* Vehicle Modals */}
            <Modal isOpen={showAssignVehicleModal} onClose={closeAllModals} title="Призначити транспорт">
                <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-4">Транспорт для водія <span className="font-bold">{selectedDriver?.fullName}</span></p>
                    <select
                        value={selectedVehicleId || ''}
                        onChange={(e) => setSelectedVehicleId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900"
                    >
                        <option value="">-- Оберіть транспорт --</option>
                        {vehicles.filter(v => !v.assignedDriverId || v.assignedDriverId === selectedDriver?.id).map(v => (
                            <option key={v.id} value={v.id}>{v.model} ({v.licensePlate})</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-3">
                    <button onClick={closeAllModals} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl">Скасувати</button>
                    <button onClick={handleAssignVehicle} disabled={isActionSubmitting || !selectedVehicleId} className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl">
                        {isActionSubmitting ? 'Збереження...' : 'Призначити'}
                    </button>
                </div>
            </Modal>

            <Modal isOpen={showUnassignVehicleModal} onClose={closeAllModals} title="Відкріпити транспорт?">
                <div className="text-center p-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"><Truck className="w-8 h-8 text-amber-600" /></div>
                    <p className="text-slate-600 mb-8">Відкріпити транспорт від водія <strong>{selectedDriver?.fullName}</strong>?</p>
                    <div className="flex gap-3">
                        <button onClick={closeAllModals} className="flex-1 px-6 py-3 border border-slate-300 rounded-xl">Скасувати</button>
                        <button onClick={handleUnassignVehicle} disabled={isActionSubmitting} className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl">
                            {isActionSubmitting ? 'Відкріплення...' : 'Відкріпити'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
