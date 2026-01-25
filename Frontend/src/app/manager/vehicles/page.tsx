'use client';

import { useState, useEffect } from 'react';
import { Truck, CheckCircle, Settings, CircleCheck, Search, Filter, ChevronDown, Edit, Trash2, X, Eye } from 'lucide-react';
import { vehiclesService } from '@/services/vehicles.service';
import { driversService } from '@/services/drivers.service';
import { useAuth } from '@/contexts/AuthContext';
import { Driver } from '@/types/drivers.types';
import { Vehicle, VehicleStatus, VehicleStats } from '@/types/vehicle.types';

export default function VehiclesPage() {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [stats, setStats] = useState<VehicleStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    // Permissions
    const hasViewPermission = user?.permissions?.some(p => p.code === 'vehicles.view') ?? false;
    const hasCreatePermission = user?.permissions?.some(p => p.code === 'vehicles.create') ?? false;
    const hasEditPermission = user?.permissions?.some(p => p.code === 'vehicles.edit') ?? false;
    const hasDeletePermission = user?.permissions?.some(p => p.code === 'vehicles.delete') ?? false;

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);

    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        if (hasViewPermission) {
            loadData();
        } else {
            setIsLoading(false);
        }
    }, [hasViewPermission]);

    const handleUnassignDriver = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        setIsUnassignModalOpen(true);
    };

    const handleConfirmUnassign = async () => {
        if (!selectedVehicle || !selectedVehicle.assignedDriverId) return;

        try {
            await vehiclesService.unassign(selectedVehicle.id, selectedVehicle.assignedDriverId);
            setIsUnassignModalOpen(false);
            setSelectedVehicle(null);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка при відкріпленні водія');
        }
    };

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [vehiclesData, driversData, statsData] = await Promise.all([
                vehiclesService.getAll(),
                driversService.getAll(),
                vehiclesService.getStats()
            ]);
            setVehicles(vehiclesData);
            setDrivers(driversData);
            setStats(statsData);
        } catch (err: any) {
            setError(err.message || 'Помилка завантаження даних');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            model: formData.get('model') as string,
            licensePlate: formData.get('licensePlate') as string,
            type: formData.get('type') as string,
            fuelType: formData.get('fuelType') as string,
            fuelConsumption: parseFloat(formData.get('fuelConsumption') as string),
            status: formData.get('status') as VehicleStatus,
        };

        try {
            await vehiclesService.create(data);
            setIsAddModalOpen(false);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка створення транспорту');
        }
    };

    const handleUpdateVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedVehicle) return;

        const formData = new FormData(e.currentTarget);
        const data = {
            model: formData.get('model') as string,
            licensePlate: formData.get('licensePlate') as string,
            type: formData.get('type') as string,
            fuelType: formData.get('fuelType') as string,
            fuelConsumption: parseFloat(formData.get('fuelConsumption') as string),
            status: formData.get('status') as VehicleStatus,
        };

        try {
            await vehiclesService.update(selectedVehicle.id, data);
            setIsEditModalOpen(false);
            setSelectedVehicle(null);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка оновлення транспорту');
        }
    };

    const handleDeleteVehicle = async () => {
        if (!selectedVehicle) return;

        try {
            await vehiclesService.delete(selectedVehicle.id);
            setIsDeleteModalOpen(false);
            setSelectedVehicle(null);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка видалення транспорту');
        }
    };

    const handleAssignDriver = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedVehicle) return;

        const formData = new FormData(e.currentTarget);
        const driverId = parseInt(formData.get('driverId') as string);

        try {
            await vehiclesService.assign(selectedVehicle.id, { driverId, isPrimary: true });
            setIsAssignModalOpen(false);
            setSelectedVehicle(null);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка призначення водія');
        }
    };

    const filteredVehicles = vehicles.filter(v => {
        const matchesSearch = v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
        const matchesType = typeFilter === 'all' || v.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusColor = (status: VehicleStatus) => {
        switch (status) {
            case VehicleStatus.Available: return 'bg-blue-100 text-blue-700';
            case VehicleStatus.InUse: return 'bg-green-100 text-green-700';
            case VehicleStatus.Maintenance: return 'bg-orange-100 text-orange-700';
            case VehicleStatus.Inactive: return 'bg-slate-100 text-slate-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: VehicleStatus) => {
        switch (status) {
            case VehicleStatus.Available: return 'Доступний';
            case VehicleStatus.InUse: return 'В дорозі';
            case VehicleStatus.Maintenance: return 'Обслуговування';
            case VehicleStatus.Inactive: return 'Неактивний';
            default: return status;
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!hasViewPermission) {
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

    // Dynamic stats labels like in mockup
    const statsCards = [
        {
            title: 'Всього транспорту',
            value: stats?.totalVehicles ?? 0,
            change: stats?.addedThisMonth ? `+${stats.addedThisMonth}` : '0',
            subtitle: 'цього місяця',
            icon: Truck,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            title: 'В дорозі',
            value: stats?.inUseCount ?? 0,
            subtitle: `${stats?.totalVehicles && stats.totalVehicles > 0 ? Math.round((stats.inUseCount / stats.totalVehicles) * 100) : 0}% від загальної кількості`,
            icon: CheckCircle,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
        },
        {
            title: 'На обслуговуванні',
            value: stats?.maintenanceCount ?? 0,
            badge: stats?.maintenanceCount && stats.maintenanceCount > 0 ? 'Потрібна увага' : undefined,
            icon: Settings,
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-600',
        },
        {
            title: 'Доступні',
            value: stats?.availableCount ?? 0,
            subtitle: 'Готові до рейсу',
            icon: CircleCheck,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">Транспорт</h1>
                    {hasCreatePermission && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <span className="text-lg">+</span>
                            Додати транспорт
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-2">{stat.title}</p>
                                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                {stat.change && stat.change !== '0' && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                        {stat.change}
                                    </span>
                                )}
                                {stat.badge && (
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                        {stat.badge}
                                    </span>
                                )}
                                <span className="text-slate-500">{stat.subtitle}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Пошук за номером, маркою або моделлю..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="all">Всі статуси</option>
                                <option value={VehicleStatus.InUse}>В дорозі</option>
                                <option value={VehicleStatus.Maintenance}>Обслуговування</option>
                                <option value={VehicleStatus.Available}>Доступний</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="appearance-none px-4 py-2.5 pr-10 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option value="all">Всі типи</option>
                                <option value="Вантажівка">Вантажівка</option>
                                <option value="Фургон">Фургон</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        <button className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Фільтри
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')}><X className="w-5 h-5" /></button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Транспорт</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Паливо</th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Норма витрати л/100км</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Водій</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredVehicles.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-900">{v.model}</p>
                                        <p className="text-xs text-slate-500">{v.licensePlate}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{v.type}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{v.fuelType}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 text-center">{v.fuelConsumption}</td>
                                    <td className="px-6 py-4">
                                        {v.assignedDriverName ? (
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 mb-0.5">{v.assignedDriverName}</span>
                                                {hasEditPermission && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => { setSelectedVehicle(v); setIsAssignModalOpen(true); }}
                                                            className="text-[11px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                                        >
                                                            Змінити
                                                        </button>
                                                        <span className="text-slate-300 text-[10px]">|</span>
                                                        <button
                                                            onClick={() => handleUnassignDriver(v)}
                                                            className="text-[11px] text-red-500 hover:text-red-600 font-medium transition-colors"
                                                        >
                                                            Відкріпити
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { setSelectedVehicle(v); setIsAssignModalOpen(true); }}
                                                className="text-sm text-blue-600 hover:underline font-medium"
                                            >
                                                Призначити водія
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(v.status)}`}>
                                            {getStatusText(v.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors" title="Переглянути">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            {hasEditPermission && (
                                                <button
                                                    onClick={() => { setSelectedVehicle(v); setIsEditModalOpen(true); }}
                                                    className="text-slate-400 hover:text-slate-600 transition-colors"
                                                    title="Редагувати"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                            )}
                                            {hasDeletePermission && (
                                                <button
                                                    onClick={() => { setSelectedVehicle(v); setIsDeleteModalOpen(true); }}
                                                    className="text-slate-400 hover:text-red-600 transition-colors"
                                                    title="Видалити"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer - Mockup style */}
                <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-white">
                    <p className="text-sm text-slate-600">
                        Показано <span className="font-medium">1</span> до <span className="font-medium">{filteredVehicles.length}</span> з <span className="font-medium">{vehicles.length}</span> транспортних засобів
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">Попередня</button>
                        <div className="flex gap-1">
                            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-md text-sm font-medium shadow-sm">1</button>
                        </div>
                        <button className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors">Наступна</button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isAddModalOpen && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Додати транспорт</h2>
                        <form onSubmit={handleCreateVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Модель</label>
                                <input name="model" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Держ. номер</label>
                                <input name="licensePlate" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Тип</label>
                                <select name="type" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-slate-900">
                                    <option value="Вантажівка">Вантажівка</option>
                                    <option value="Фургон">Фургон</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Паливо</label>
                                <select name="fuelType" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-slate-900">
                                    <option value="Дизель">Дизель</option>
                                    <option value="Бензин">Бензин</option>
                                    <option value="Електро">Електро</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Норма витрати (л/100км)</label>
                                <input name="fuelConsumption" type="number" step="0.1" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-slate-900" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Статус</label>
                                <select name="status" className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-slate-900">
                                    <option value={VehicleStatus.Available}>Доступний</option>
                                    <option value={VehicleStatus.Maintenance}>Обслуговування</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">Скасувати</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Зберегти</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedVehicle && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Редагувати {selectedVehicle.model}</h2>
                        <form onSubmit={handleUpdateVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Модель</label>
                                <input name="model" defaultValue={selectedVehicle.model} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Держ. номер</label>
                                <input name="licensePlate" defaultValue={selectedVehicle.licensePlate} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Тип</label>
                                <select name="type" defaultValue={selectedVehicle.type} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-slate-900">
                                    <option value="Вантажівка">Вантажівка</option>
                                    <option value="Фургон">Фургон</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Паливо</label>
                                <select name="fuelType" defaultValue={selectedVehicle.fuelType} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-slate-900">
                                    <option value="Дизель">Дизель</option>
                                    <option value="Бензин">Бензин</option>
                                    <option value="Електро">Електро</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Норма витрати (л/100км)</label>
                                <input name="fuelConsumption" type="number" step="0.1" defaultValue={selectedVehicle.fuelConsumption} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600/20 outline-none text-slate-900" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Статус</label>
                                <select name="status" defaultValue={selectedVehicle.status} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-slate-900">
                                    <option value={VehicleStatus.Available}>Доступний</option>
                                    <option value={VehicleStatus.InUse}>В дорозі</option>
                                    <option value={VehicleStatus.Maintenance}>Обслуговування</option>
                                    <option value={VehicleStatus.Inactive}>Неактивний</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">Скасувати</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Зберегти зміни</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && selectedVehicle && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Видалити транспорт?</h2>
                        <p className="text-slate-600 mb-8">Ви впевнені що хочете видалити <span className="font-semibold">{selectedVehicle.model}</span>? Цю дію неможливо скасувати.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">Скасувати</button>
                            <button onClick={handleDeleteVehicle} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">Видалити</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {isAssignModalOpen && selectedVehicle && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Призначити водія</h2>
                        <form onSubmit={handleAssignDriver} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Для {selectedVehicle.model} ({selectedVehicle.licensePlate})</label>
                                <select name="driverId" required className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none text-slate-900">
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.fullName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setIsAssignModalOpen(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">Скасувати</button>
                                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Призначити</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Unassign Modal */}
            {isUnassignModalOpen && selectedVehicle && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl border border-slate-200">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                            <X className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Відкріпити водія?</h2>
                        <p className="text-slate-600 mb-8">
                            Ви впевнені, що хочете відкріпити водія <span className="font-semibold text-slate-900">{selectedVehicle.assignedDriverName}</span> від <span className="font-semibold text-slate-900">{selectedVehicle.model}</span>?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setIsUnassignModalOpen(false); setSelectedVehicle(null); }}
                                className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleConfirmUnassign}
                                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
                            >
                                Відкріпити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}