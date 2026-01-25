'use client';

import { useState, useEffect } from 'react';
import { Users, CheckCircle, Truck, Moon, Search, Star, Trash2, Edit } from 'lucide-react';
import { driversService } from '@/services/drivers.service';
import { useAuth } from '@/contexts/AuthContext';
import type { Driver, DriverStats, DriverStatus } from '@/types/drivers.types';
import { DriverStatusLabels } from '@/types/drivers.types';

export default function DriversPage() {
    const { user } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [stats, setStats] = useState<DriverStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Check permissions
    const hasViewPermission = user?.permissions?.some(p => p.code === 'drivers.view') ?? false;
    const hasCreatePermission = user?.permissions?.some(p => p.code === 'drivers.create') ?? false;
    const hasEditPermission = user?.permissions?.some(p => p.code === 'drivers.edit') ?? false;
    const hasDeletePermission = user?.permissions?.some(p => p.code === 'drivers.delete') ?? false;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (hasViewPermission) {
            loadData();
        } else {
            setIsLoading(false);
        }
    }, [hasViewPermission]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError('');
            const [driversData, statsData] = await Promise.all([
                driversService.getAll(),
                driversService.getStats()
            ]);
            setDrivers(driversData);
            setStats(statsData);
        } catch (err: any) {
            setError(err.message || 'Помилка завантаження даних');
        } finally {
            setIsLoading(false);
        }
    };

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [driverToDelete, setDriverToDelete] = useState<{ id: number; name: string } | null>(null);

    const handleDeleteClick = (id: number, name: string) => {
        setDriverToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!driverToDelete) return;

        try {
            await driversService.delete(driverToDelete.id);
            setDeleteModalOpen(false);
            setDriverToDelete(null);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка видалення водія');
        }
    };

    // Edit modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);

    const handleEditClick = (driver: Driver) => {
        setDriverToEdit(driver);
        setEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!driverToEdit) return;

        const formData = new FormData(e.currentTarget);
        const updateData = {
            fullName: formData.get('fullName') as string,
            phone: formData.get('phone') as string || undefined,
            licenseNumber: formData.get('licenseNumber') as string || undefined,
            status: formData.get('status') as DriverStatus,
            isActive: formData.get('isActive') === 'true',
        };

        try {
            await driversService.update(driverToEdit.id, updateData);
            setEditModalOpen(false);
            setDriverToEdit(null);
            await loadData();
        } catch (err: any) {
            setError(err.message || 'Помилка оновлення водія');
        }
    };

    // Filter and search drivers
    const filteredDrivers = drivers.filter(driver => {
        const matchesSearch = driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.assignedVehicle?.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            driver.assignedVehicle?.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || driver.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OnTrip':
                return 'bg-green-100 text-green-700';
            case 'Available':
                return 'bg-blue-100 text-blue-700';
            case 'OnBreak':
                return 'bg-orange-100 text-orange-700';
            case 'Offline':
                return 'bg-slate-100 text-slate-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case 'OnTrip':
                return 'bg-green-500';
            case 'Available':
                return 'bg-blue-500';
            case 'OnBreak':
                return 'bg-orange-500';
            case 'Offline':
                return 'bg-slate-400';
            default:
                return 'bg-gray-500';
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 bg-slate-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Завантаження...</p>
                </div>
            </div>
        );
    }

    // Check if user has permission to view drivers
    if (!hasViewPermission) {
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

    if (error && !isModalOpen) {
        return (
            <div className="p-8 bg-slate-50 min-h-screen">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Водії</h1>
                    </div>
                    {hasCreatePermission && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <span className="text-lg">+</span>
                            Додати водія
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-2">Всього водіїв</p>
                                <p className="text-3xl font-bold text-slate-900">{stats.totalDrivers}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-2">Активні</p>
                                <p className="text-3xl font-bold text-slate-900">{stats.activeDrivers}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">
                            {stats.totalDrivers > 0 ? Math.round((stats.activeDrivers / stats.totalDrivers) * 100) : 0}% від загальної кількості
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-2">На маршруті</p>
                                <p className="text-3xl font-bold text-slate-900">{stats.onTripDrivers}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Truck className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">
                            {stats.totalDrivers > 0 ? Math.round((stats.onTripDrivers / stats.totalDrivers) * 100) : 0}% від загальної кількості
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-2">Офлайн</p>
                                <p className="text-3xl font-bold text-slate-900">{stats.offlineDrivers}</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                                <Moon className="w-6 h-6 text-slate-600" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">
                            {stats.totalDrivers > 0 ? Math.round((stats.offlineDrivers / stats.totalDrivers) * 100) : 0}% від загальної кількості
                        </p>
                    </div>
                </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Пошук водія за ім'ям, телефоном або авто..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                        <option value="all">Всі статуси</option>
                        <option value="Available">Вільний</option>
                        <option value="OnTrip">На маршруті</option>
                        <option value="OnBreak">На перерві</option>
                        <option value="Offline">Офлайн</option>
                    </select>
                </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Водій</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Транспорт</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Телефон</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Рейтинг</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Поїздки</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {filteredDrivers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        {searchQuery || statusFilter !== 'all' ? 'Водіїв не знайдено' : 'Немає водіїв'}
                                    </td>
                                </tr>
                            ) : (
                                filteredDrivers.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                    {driver.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{driver.fullName}</p>
                                                    <p className="text-xs text-slate-500">{driver.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(driver.status)}`}></span>
                                                {DriverStatusLabels[driver.status as DriverStatus]}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {driver.assignedVehicle ? (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{driver.assignedVehicle.model}</p>
                                                    <p className="text-xs text-slate-500">{driver.assignedVehicle.licensePlate}</p>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">Не призначено</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-700">{driver.phone || '—'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {driver.rating ? (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                    <span className="text-sm font-semibold text-slate-900">{driver.rating.toFixed(1)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-slate-900">{driver.totalTrips}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">

                                                {hasEditPermission && (
                                                    <button
                                                        onClick={() => handleEditClick(driver)}
                                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                                        title="Редагувати"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                )}
                                                {hasDeletePermission && (
                                                    <button
                                                        onClick={() => handleDeleteClick(driver.id, driver.fullName)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                                        title="Видалити"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Driver Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Додати нового водія</h2>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setError('');

                            const formData = new FormData(e.currentTarget);
                            const driverData = {
                                email: formData.get('email') as string,
                                fullName: formData.get('fullName') as string,
                                password: formData.get('password') as string,
                                phone: formData.get('phone') as string || undefined,
                                licenseNumber: formData.get('licenseNumber') as string || undefined,
                            };

                            try {
                                await driversService.create(driverData);
                                setIsModalOpen(false);
                                await loadData();
                                e.currentTarget.reset();
                            } catch (err: any) {
                                setError(err.message || 'Помилка створення водія');
                            }
                        }} className="space-y-4 mb-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Повне ім'я <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="Іван Петренко"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="driver@smartlogist.ua"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Пароль <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="Мінімум 8 символів"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Мінімум 8 символів
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Телефон
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="+380671234567"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    Формат: +380XXXXXXXXX
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Номер водійського посвідчення
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="ABC123456"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setError('');
                                    }}
                                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Додати водія
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Driver Modal */}
            {editModalOpen && driverToEdit && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Редагувати водія</h2>

                        <form onSubmit={handleEditSubmit} className="space-y-4 mb-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Повне ім'я <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    defaultValue={driverToEdit.fullName}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="Іван Петренко"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email (не можна змінити)
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    defaultValue={driverToEdit.email}
                                    className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Телефон
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    defaultValue={driverToEdit.phone || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="+380671234567"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Номер водійського посвідчення
                                </label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    defaultValue={driverToEdit.licenseNumber || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 placeholder:text-slate-600"
                                    placeholder="ABC123456"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Статус
                                </label>
                                <select
                                    name="status"
                                    defaultValue={driverToEdit.status}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                                >
                                    <option value="Available">Вільний</option>
                                    <option value="OnTrip">На маршруті</option>
                                    <option value="OnBreak">На перерві</option>
                                    <option value="Offline">Офлайн</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Активний
                                </label>
                                <select
                                    name="isActive"
                                    defaultValue={driverToEdit.isActive ? 'true' : 'false'}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900"
                                >
                                    <option value="true">Так</option>
                                    <option value="false">Ні</option>
                                </select>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditModalOpen(false);
                                        setDriverToEdit(null);
                                        setError('');
                                    }}
                                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Зберегти зміни
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && driverToDelete && (
                <div className="fixed inset-0 backdrop-blur-[3px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Видалити водія?</h2>
                        <p className="text-slate-600 mb-2">
                            Ви впевнені що хочете видалити водія <span className="font-semibold text-slate-900">{driverToDelete.name}</span>?
                        </p>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setDeleteModalOpen(false);
                                    setDriverToDelete(null);
                                    setError('');
                                }}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Видалити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}