'use client';

import { Truck, CheckCircle, Settings, CircleCheck, Search, Clock, Star, Edit, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { useVehicles } from '@/hooks/useVehicles';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DataTable, { Column } from '@/components/ui/DataTable';
import VehicleForm from '@/components/vehicles/VehicleForm';
import StatusIndicator from '@/components/ui/StatusIndicator';
import Badge from '@/components/ui/Badge';
import type { Vehicle } from '@/types/vehicle.types';

export default function VehiclesPage() {
    const {
        vehicles,
        drivers,
        stats,
        totalItems,
        currentPage,
        setCurrentPage,
        totalPages,
        pageSize,
        setPageSize,
        isLoading,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        permissions,
        modals,
        selectedVehicle,
        actions
    } = useVehicles();

    const columns: Column<Vehicle>[] = [
        {
            header: 'Транспорт',
            key: 'model',
            render: (v) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 flex-shrink-0">
                        <Star className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{v.model}</p>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{v.licensePlate}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Тип',
            key: 'type',
            render: (v) => <Badge variant="neutral">{v.type}</Badge>
        },
        {
            header: 'Паливо',
            key: 'fuelType',
            render: (v) => <span className="text-sm text-slate-600">{v.fuelType}</span>
        },
        {
            header: 'Витрата',
            key: 'fuelConsumption',
            render: (v) => <span className="text-sm font-bold text-slate-700">{v.fuelConsumption} л/100км</span>
        },
        {
            header: 'Водій',
            key: 'assignedDriverName',
            render: (v) => v.assignedDriverName ? (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 line-clamp-1">{v.assignedDriverName}</span>
                    <button
                        onClick={() => modals.unassign.open(v)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Відкріпити"
                    >
                        <UserMinus className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => modals.assign.open(v)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-2 py-1 rounded-md"
                >
                    <UserPlus className="w-3 h-3" />
                    Призначити
                </button>
            )
        },
        {
            header: 'Тех. обслуговування',
            key: 'kmUntilMaintenance',
            render: (v) => {
                const isUrgent = v.kmUntilMaintenance < 500;
                const isWarning = v.kmUntilMaintenance < 1500;

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-slate-400'}`} />
                            <span className={`text-sm font-bold ${isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-700'}`}>
                                {v.kmUntilMaintenance.toLocaleString()} км
                            </span>
                        </div>
                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all ${isUrgent ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(100, (v.kmUntilMaintenance / 10000) * 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium tracking-tight uppercase">До наступного ТО</p>
                    </div>
                );
            }
        },
        {
            header: 'Статус',
            key: 'status',
            render: (v) => (
                <div className="flex flex-col gap-1">
                    <StatusIndicator status={v.status} type="vehicle" />
                    {v.hasPendingDeletion && (
                        <Badge variant="warning" pulse>
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Запит на видалення
                        </Badge>
                    )}
                </div>
            )
        },
        {
            header: 'Дії',
            key: 'actions',
            render: (v) => (
                <div className="flex items-center gap-3">
                    {permissions.edit && (
                        <button
                            onClick={() => modals.edit.open(v)}
                            disabled={v.hasPendingDeletion}
                            className={`transition-colors ${v.hasPendingDeletion
                                ? 'text-slate-200 cursor-not-allowed'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                            title="Редагувати"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                    {permissions.edit && (
                        <button
                            onClick={() => actions.performMaintenance(v.id)}
                            disabled={v.hasPendingDeletion}
                            className={`transition-colors ${v.hasPendingDeletion
                                ? 'text-slate-200 cursor-not-allowed'
                                : 'text-slate-400 hover:text-emerald-600'
                                }`}
                            title="Виконати ТО сьогодні"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    )}
                    {permissions.delete && (
                        <button
                            onClick={() => modals.delete.open(v)}
                            disabled={v.hasPendingDeletion}
                            className={`transition-colors ${v.hasPendingDeletion
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-red-600'
                                }`}
                            title={v.hasPendingDeletion ? "Запит вже обробляється" : "Видалити"}
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    if (!permissions.view && !isLoading) {
        return (
            <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-md">
                    <Truck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Доступ заборонено</h2>
                    <p className="text-slate-600">У вас немає дозволу на перегляд списку транспорту.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">Транспорт</h1>
                    {permissions.create && (
                        <Button onClick={modals.add.open} icon={<span className="text-lg">+</span>}>
                            Додати транспорт
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Всього транспорту" value={stats.totalVehicles} icon={Truck} color="blue" trend={stats.addedThisMonth > 0 ? { value: `+${stats.addedThisMonth}`, isPositive: true } : undefined} />
                    <StatCard
                        title="В дорозі"
                        value={stats.inUseCount}
                        icon={CheckCircle}
                        color="green"
                        trend={{ value: `${stats.totalVehicles > 0 ? Math.round((stats.inUseCount / stats.totalVehicles) * 100) : 0}%`, isPositive: true }}
                    />
                    <StatCard
                        title="На обслуговуванні"
                        value={stats.maintenanceCount}
                        icon={Settings}
                        color="amber"
                        trend={stats.maintenanceCount > 0 ? { value: 'Потрібна увага', isPositive: false } : undefined}
                    />
                    <StatCard
                        title="Доступні"
                        value={stats.availableCount}
                        icon={CircleCheck}
                        color="purple"
                        trend={{ value: 'Готові до рейсу', isPositive: true }}
                    />
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Пошук за номером, маркою або моделлю..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="all">Всі статуси</option>
                            <option value="Available">Вільний</option>
                            <option value="OnTrip">В дорозі</option>
                            <option value="InService">Обслуговування</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="all">Всі типи</option>
                            <option value="Truck">Вантажівка</option>
                            <option value="Van">Фургон</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={vehicles}
                columns={columns}
                isLoading={isLoading}
                emptyMessage={searchQuery ? 'Транспорт не знайдено' : 'Немає транспорту'}
                pagination={{
                    currentPage,
                    totalPages,
                    totalItems,
                    pageSize,
                    onPageChange: setCurrentPage,
                    onPageSizeChange: setPageSize,
                    label: 'транспортних засобів'
                }}
            />

            {/* Modals */}
            <Modal isOpen={modals.add.isOpen} onClose={modals.add.close} title="Додати транспорт" maxWidth="2xl">
                <VehicleForm onSubmit={actions.create} onCancel={modals.add.close} />
            </Modal>

            <Modal isOpen={modals.edit.isOpen} onClose={modals.edit.close} title={`Редагувати ${selectedVehicle?.model}`} maxWidth="2xl">
                <VehicleForm vehicle={selectedVehicle!} onSubmit={(data) => actions.update(selectedVehicle!.id, data)} onCancel={modals.edit.close} />
            </Modal>

            <Modal isOpen={modals.delete.isOpen} onClose={modals.delete.close} title="Видалити транспорт?" maxWidth="sm">
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <Truck className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-slate-600 mb-8">
                        Ви впевнені, що хочете видалити <span className="font-semibold text-slate-900">{selectedVehicle?.model}</span>?
                    </p>
                    <div className="flex flex-col w-full gap-3">
                        <Button variant="danger" onClick={actions.delete} className="w-full">Видалити</Button>
                        <Button variant="secondary" onClick={modals.delete.close} className="w-full">Скасувати</Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={modals.assign.isOpen} onClose={modals.assign.close} title="Призначити водія" maxWidth="md">
                {selectedVehicle && (
                    <div className="space-y-4 p-4">
                        <p className="text-sm text-slate-600 mb-4">Виберіть водія для {selectedVehicle.model} ({selectedVehicle.licensePlate})</p>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {drivers.filter(d => d.status === 'Available').length === 0 ? (
                                <p className="text-center py-4 text-slate-500 text-sm italic">Немає вільних водіїв</p>
                            ) : (
                                drivers.filter(d => d.status === 'Available').map(driver => (
                                    <button
                                        key={driver.id}
                                        onClick={() => actions.assignDriver(driver.id)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                {driver.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">{driver.fullName}</p>
                                                <p className="text-xs text-slate-500">{driver.phone || 'Немає телефону'}</p>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-bold text-blue-600 uppercase">Вибрати</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                        <Button variant="secondary" onClick={modals.assign.close} className="w-full">Скасувати</Button>
                    </div>
                )}
            </Modal>

            <Modal isOpen={modals.unassign.isOpen} onClose={modals.unassign.close} title="Відкріпити водія?" maxWidth="md">
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                        <Clock className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-slate-600 mb-8">
                        Ви впевнені, що хочете відкріпити водія <span className="font-semibold text-slate-900">{selectedVehicle?.assignedDriverName}</span> від <span className="font-semibold text-slate-900">{selectedVehicle?.model}</span>?
                    </p>
                    <div className="flex flex-col w-full gap-3">
                        <Button variant="danger" onClick={actions.unassignDriver} className="w-full">Відкріпити</Button>
                        <Button variant="secondary" onClick={modals.unassign.close} className="w-full">Скасувати</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}