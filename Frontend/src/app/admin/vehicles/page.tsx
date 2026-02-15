'use client';
// Загальний реєстр транспортних засобів системи з можливістю редагування технічних параметрів.

import { useState } from 'react';
import { Truck, CheckCircle2, Wrench, Edit, Trash2, AlertCircle } from 'lucide-react';
import { vehiclesService } from '@/services/vehicles.service';
import type { Vehicle, VehicleStatus } from '@/types/vehicle.types';
import useResource from '@/hooks/useResource';
import DataTable, { Column } from '@/components/ui/DataTable';
import PageHeader from '@/components/ui/PageHeader';
import FilterBar from '@/components/ui/FilterBar';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import StatusIndicator from '@/components/ui/StatusIndicator';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { useNotifications } from '@/contexts/NotificationContext';

export default function AdminVehiclesPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const { success, error } = useNotifications();

    const {
        paginatedData: vehicles,
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
        selectedItem: selectedVehicle,
        loadData,
        handleCreateOpen,
        handleEditOpen,
        handleDeleteOpen,
        handleDelete,
        closeModals,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        pageSize,
        setPageSize
    } = useResource<Vehicle>({
        fetchFn: vehiclesService.getAllAdmin,
        deleteFn: vehiclesService.deleteAdmin,
        filterFn: (v, query) => {
            const matchesSearch = v.model.toLowerCase().includes(query.toLowerCase()) ||
                v.licensePlate.toLowerCase().includes(query.toLowerCase());
            const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
            return !!(matchesSearch && matchesStatus);
        }
    });

    const handleFormSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            if (showCreateModal) {
                await vehiclesService.createAdmin(data);
            } else if (showEditModal && selectedVehicle) {
                await vehiclesService.updateAdmin(selectedVehicle.id, data);
            }
            closeModals();
            await loadData(false);
            success(showCreateModal ? 'Транспорт успішно додано' : 'Дані транспорту оновлено');
            return true;
        } catch (err: any) {
            error(err.message || 'Помилка при збереженні');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<Vehicle>[] = [
        {
            header: 'Транспорт',
            key: 'model',
            render: (v) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{v.model}</div>
                        <div className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">{v.licensePlate}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Тип / Паливо',
            key: 'type',
            render: (v) => (
                <>
                    <div className="text-sm text-slate-900">{v.type}</div>
                    <div className="text-xs text-slate-500">{v.fuelType}</div>
                </>
            )
        },
        {
            header: 'Витрати',
            key: 'fuelConsumption',
            render: (v) => <div className="text-sm font-medium text-slate-900">{v.fuelConsumption} л/100км</div>
        },
        {
            header: 'Статус',
            key: 'status',
            render: (v) => (
                <div className="flex flex-col gap-1.5">
                    <StatusIndicator status={v.status} type="vehicle" />
                    {v.hasPendingDeletion && (
                        <Badge variant="warning" pulse>
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Запит на видалення
                        </Badge>
                    )}
                    {v.hasPendingUpdate && (
                        <Badge variant="info" pulse>
                            Запит на редагування
                        </Badge>
                    )}
                </div>
            )
        },
        {
            header: 'Водій',
            key: 'assignedDriverName',
            render: (v) => v.assignedDriverName ? (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {v.assignedDriverName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{v.assignedDriverName}</span>
                </div>
            ) : (
                <span className="text-xs text-slate-400 italic">Не призначено</span>
            )
        },
        {
            header: 'Дії',
            key: 'actions',
            headerClassName: 'text-right',
            className: 'text-right',
            render: (v) => (
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEditOpen(v)} className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all">
                        <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteOpen(v)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <PageHeader
                title="Управління автопарком"
                description="Перегляд та керування всіма транспортними засобами компанії"
                onRefresh={() => loadData()}
                primaryAction={{
                    label: 'Додати транспорт',
                    onClick: handleCreateOpen
                }}
            />

            <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Пошук за моделлю або номером..."
            >
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none appearance-none text-slate-900 cursor-pointer font-medium"
                >
                    <option value="all">Усі статуси</option>
                    <option value="Available">Доступний</option>
                    <option value="InUse">В дорозі</option>
                    <option value="Maintenance">ТО</option>
                </select>
            </FilterBar>

            <DataTable
                data={vehicles}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="Транспорту не знайдено"
                pagination={{
                    currentPage,
                    totalPages,
                    totalItems,
                    pageSize,
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                    label: 'одиниць транспорту'
                }}
            />

            <Modal
                isOpen={showCreateModal || showEditModal}
                onClose={closeModals}
                title={showCreateModal ? 'Додати транспорт' : 'Редагувати транспорт'}
            >
                <VehicleForm
                    vehicle={selectedVehicle || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={closeModals}
                />
            </Modal>

            <Modal
                isOpen={showDeleteModal}
                onClose={closeModals}
                title="Видалити транспорт?"
            >
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 mb-8">
                        Ви впевнені, що хочете видалити <strong>{selectedVehicle?.model}</strong>? Цю дію неможливо скасувати.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button onClick={closeModals} className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all">
                            Скасувати
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Видалення...' : 'Так, видалити'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
