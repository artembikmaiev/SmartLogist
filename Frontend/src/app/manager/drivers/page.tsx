'use client';

import { Users, CheckCircle, Truck, Moon, Search, Clock, Star, Edit, Trash2, Eye } from 'lucide-react';
import { useDrivers } from '@/hooks/useDrivers';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DataTable, { Column } from '@/components/ui/DataTable';
import DriverForm from '@/components/drivers/DriverForm';
import StatusIndicator from '@/components/ui/StatusIndicator';
import Badge from '@/components/ui/Badge';
import type { Driver } from '@/types/drivers.types';

export default function DriversPage() {
    const {
        drivers,
        stats,
        totalItems,
        currentPage,
        setCurrentPage,
        totalPages,
        pageSize,
        setPageSize,
        pendingRequests,
        isLoading,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        permissions,
        modals,
        selectedDriver,
        actions
    } = useDrivers();

    const columns: Column<Driver>[] = [
        {
            header: 'Водій',
            key: 'fullName',
            render: (driver) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {driver.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-1">{driver.fullName}</p>
                        <p className="text-xs text-slate-500 underline decoration-slate-200">{driver.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Статус',
            key: 'status',
            render: (driver) => (
                <div className="flex flex-col gap-1">
                    <StatusIndicator status={driver.status} type="driver" />
                    {driver.hasPendingDeletion && (
                        <Badge variant="warning" pulse>
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Запит на видалення
                        </Badge>
                    )}
                </div>
            )
        },
        {
            header: 'Транспорт',
            key: 'assignedVehicle',
            render: (driver) => driver.assignedVehicle ? (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">{driver.assignedVehicle.model}</span>
                    <span className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">{driver.assignedVehicle.licensePlate}</span>
                </div>
            ) : (
                <span className="text-xs text-slate-400 italic">Не призначено</span>
            )
        },
        {
            header: 'Телефон',
            key: 'phone',
            render: (driver) => <span className="text-sm text-slate-600 font-medium">{driver.phone || '—'}</span>
        },
        {
            header: 'Рейтинг',
            key: 'rating',
            render: (driver) => driver.rating ? (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg w-fit border border-amber-100">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-700">{driver.rating.toFixed(1)}</span>
                </div>
            ) : (
                <span className="text-sm text-slate-400">—</span>
            )
        },
        {
            header: 'Поїздки',
            key: 'totalTrips',
            className: 'text-sm font-bold text-slate-700'
        },
        {
            header: 'Дії',
            key: 'actions',
            render: (driver) => (
                <div className="flex items-center gap-3">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Переглянути">
                        <Eye className="w-5 h-5" />
                    </button>
                    {permissions.edit && (
                        <button
                            onClick={() => modals.edit.open(driver)}
                            disabled={driver.hasPendingDeletion}
                            className={`transition-colors ${driver.hasPendingDeletion
                                ? 'text-slate-200 cursor-not-allowed'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                            title="Редагувати"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                    {permissions.delete && (
                        <button
                            onClick={() => modals.delete.open(driver)}
                            disabled={driver.hasPendingDeletion}
                            className={`transition-colors ${driver.hasPendingDeletion
                                ? 'text-slate-300 cursor-not-allowed'
                                : 'text-slate-400 hover:text-red-600'
                                }`}
                            title={driver.hasPendingDeletion ? "Запит вже обробляється" : "Видалити"}
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
                <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md text-center shadow-sm">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Доступ заборонено</h2>
                    <p className="text-slate-600">
                        У вас немає дозволу на перегляд списку водіїв. Зверніться до адміністратора для отримання доступу.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">Водії</h1>
                    {permissions.create && (
                        <Button onClick={modals.add.open} icon={<span className="text-lg">+</span>}>
                            Додати водія
                        </Button>
                    )}
                </div>
            </div>

            {/* Pending Requests indicator */}
            {pendingRequests.length > 0 && (
                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-amber-900">Запити на розгляді ({pendingRequests.length})</p>
                            <p className="text-xs text-amber-700">Очікуйте схвалення адміністратора для нових водіїв</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Всього водіїв" value={stats.totalDrivers} icon={Users} color="blue" />
                    <StatCard
                        title="Вільні"
                        value={stats.availableDrivers}
                        icon={CheckCircle}
                        color="green"
                        trend={{ value: `${stats.totalDrivers > 0 ? Math.round((stats.availableDrivers / stats.totalDrivers) * 100) : 0}%`, isPositive: true }}
                    />
                    <StatCard
                        title="На маршруті"
                        value={stats.onTripDrivers}
                        icon={Truck}
                        color="amber"
                        trend={{ value: `${stats.totalDrivers > 0 ? Math.round((stats.onTripDrivers / stats.totalDrivers) * 100) : 0}%`, isPositive: true }}
                    />
                    <StatCard
                        title="Офлайн"
                        value={stats.offlineDrivers}
                        icon={Moon}
                        color="blue"
                        trend={{ value: `${stats.totalDrivers > 0 ? Math.round((stats.offlineDrivers / stats.totalDrivers) * 100) : 0}%`, isPositive: false }}
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
                            placeholder="Пошук водія за ім'ям, телефоном або авто..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-slate-300 text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                        <option value="all">Всі статуси</option>
                        <option value="Available">Вільний</option>
                        <option value="OnTrip">На маршруті</option>
                        <option value="OnBreak">На перерві</option>
                        <option value="Offline">Офлайн</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <DataTable
                data={drivers}
                columns={columns}
                isLoading={isLoading}
                emptyMessage={searchQuery ? 'Водіїв не знайдено' : 'Немає водіїв'}
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
            <Modal isOpen={modals.add.isOpen} onClose={modals.add.close} title="Додати нового водія" maxWidth="2xl">
                <DriverForm onSubmit={actions.create} onCancel={modals.add.close} />
            </Modal>

            <Modal isOpen={modals.edit.isOpen} onClose={modals.edit.close} title="Редагувати водія" maxWidth="2xl">
                <DriverForm driver={selectedDriver!} onSubmit={(data) => actions.update(selectedDriver!.id, data)} onCancel={modals.edit.close} />
            </Modal>

            <Modal isOpen={modals.delete.isOpen} onClose={modals.delete.close} title="Видалити водія?" maxWidth="sm">
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <Users className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-slate-600 mb-8">
                        Ви впевнені, що хочете видалити водія <span className="font-semibold text-slate-900">{selectedDriver?.fullName}</span>?
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <Button variant="danger" onClick={actions.delete} className="w-full">Видалити</Button>
                        <Button variant="secondary" onClick={modals.delete.close} className="w-full">Скасувати</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
