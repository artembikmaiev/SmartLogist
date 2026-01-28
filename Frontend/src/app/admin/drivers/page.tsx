'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2, UserCog, Link as LinkIcon, AlertCircle, Loader2, X, Check, Truck } from 'lucide-react';
import { driversService } from '@/services/drivers.service';
import { managersService, Manager } from '@/services/managers.service';
import { Driver, CreateDriverData, UpdateDriverData, DriverStats, DriverStatus } from '@/types/drivers.types';
import { vehiclesService } from '@/services/vehicles.service';
import { Vehicle } from '@/types/vehicle.types';

export default function AdminDriversPage() {
    // Data state
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [stats, setStats] = useState<DriverStats | null>(null);

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [managerFilter, setManagerFilter] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [showUnassignModal, setShowUnassignModal] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

    // Form state
    const [formData, setFormData] = useState<CreateDriverData>({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        licenseNumber: ''
    });
    const [editData, setEditData] = useState<UpdateDriverData & { id: number }>({
        id: 0,
        fullName: '',
        phone: '',
        licenseNumber: '',
        status: DriverStatus.Offline,
        isActive: true
    });
    const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null);
    const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const [driversData, managersData, vehiclesData, statsData] = await Promise.all([
                driversService.getAllAdmin(),
                managersService.getAll(),
                vehiclesService.getAllAdmin(),
                driversService.getStatsAdmin()
            ]);
            setDrivers(driversData);
            setManagers(managersData);
            setVehicles(vehiclesData);
            setStats(statsData);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Помилка завантаження даних');
            console.error('Error loading drivers data:', err);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    const filteredDrivers = useMemo(() => {
        return drivers.filter(driver => {
            const matchesSearch =
                driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                driver.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesManager = !managerFilter ||
                (managerFilter === 'unassigned' ? !driver.managerId : driver.managerId?.toString() === managerFilter);

            return matchesSearch && matchesManager;
        });
    }, [drivers, searchQuery, managerFilter]);

    // Handlers
    const handleAddDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await driversService.createAdmin(formData);
            setShowAddModal(false);
            setFormData({ email: '', password: '', fullName: '', phone: '', licenseNumber: '' });
            await loadData(false);
        } catch (err: any) {
            alert(err.message || 'Помилка при створенні водія');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditDriver = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const { id, ...data } = editData;
            await driversService.updateAdmin(id, data);
            setShowEditModal(false);
            await loadData(false);
        } catch (err: any) {
            alert(err.message || 'Помилка при оновленні водія');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDriver = async () => {
        if (!selectedDriver) return;
        try {
            setIsSubmitting(true);
            await driversService.deleteAdmin(selectedDriver.id);
            setShowDeleteModal(false);
            setSelectedDriver(null);
            await loadData(false);
        } catch (err: any) {
            alert(err.message || 'Помилка при видаленні водія');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignManager = async () => {
        if (!selectedDriver) return;
        try {
            setIsSubmitting(true);
            await driversService.assignManager(selectedDriver.id, selectedManagerId);
            setShowAssignModal(false);
            setSelectedDriver(null);
            await loadData(false);
        } catch (err: any) {
            alert(err.message || 'Помилка при призначенні менеджера');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignVehicle = async () => {
        if (!selectedDriver || !selectedVehicleId) return;
        try {
            setIsSubmitting(true);
            await driversService.assignVehicle(selectedDriver.id, selectedVehicleId);
            setShowVehicleModal(false);
            setSelectedDriver(null);
            setSelectedVehicleId(null);
            await loadData(false);
        } catch (err: any) {
            alert(err.message || 'Помилка при призначенні транспорту');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnassignVehicle = async () => {
        if (!selectedDriver || !selectedDriver.assignedVehicle) return;

        try {
            setIsSubmitting(true);
            await driversService.unassignVehicle(selectedDriver.id, selectedDriver.assignedVehicle.vehicleId);
            setShowUnassignModal(false);
            setSelectedDriver(null);
            await loadData(false);
        } catch (err: any) {
            alert(err.message || 'Помилка при відкріпленні транспорту');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openEditModal = (driver: Driver) => {
        setEditData({
            id: driver.id,
            fullName: driver.fullName,
            phone: driver.phone || '',
            licenseNumber: driver.licenseNumber || '',
            status: driver.status as any,
            isActive: driver.isActive
        });
        setShowEditModal(true);
    };

    const openAssignModal = (driver: Driver) => {
        setSelectedDriver(driver);
        setSelectedManagerId(driver.managerId || null);
        setShowAssignModal(true);
    };

    const openVehicleModal = (driver: Driver) => {
        setSelectedDriver(driver);
        setSelectedVehicleId(driver.assignedVehicle?.vehicleId || null);
        setShowVehicleModal(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Завантаження водіїв...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Управління водіями</h1>
                    <p className="text-slate-600 mt-1">Прив'язка водіїв до менеджерів та загальне управління</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200"
                >
                    <Plus className="w-5 h-5" />
                    Додати водія
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <p className="text-sm text-slate-500 mb-2">Всього водіїв</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.totalDrivers || 0}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <p className="text-sm text-slate-500 mb-2">Вільні</p>
                    <p className="text-3xl font-bold text-green-600">{stats?.availableDrivers || 0}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <p className="text-sm text-slate-500 mb-2">На рейсі</p>
                    <p className="text-3xl font-bold text-blue-600">{stats?.onTripDrivers || 0}</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <p className="text-sm text-slate-500 mb-2">Офлайн</p>
                    <p className="text-3xl font-bold text-slate-400">{stats?.offlineDrivers || 0}</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Actions Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="w-full md:flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Пошук за ім'ям, email, тел. або ліцензією..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-slate-900 placeholder:text-slate-500"
                        />
                    </div>
                    <select
                        value={managerFilter}
                        onChange={(e) => setManagerFilter(e.target.value)}
                        className="w-full md:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-slate-900"
                    >
                        <option value="">Всі менеджери</option>
                        {managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>
                                {manager.fullName}
                            </option>
                        ))}
                        <option value="unassigned">Без менеджера</option>
                    </select>
                </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Водій</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Контакти</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Посвідчення</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Менеджер</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Транспорт</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Статус</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-700">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredDrivers.length > 0 ? (
                                filteredDrivers.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-semibold text-sm">
                                                        {driver.fullName.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{driver.fullName}</p>
                                                    <p className="text-xs text-slate-500">{driver.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-600">{driver.phone || '-'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-mono text-sm text-slate-900">{driver.licenseNumber || '-'}</p>
                                        </td>
                                        <td className="p-4">
                                            {driver.managerName ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <UserCog className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900">{driver.managerName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-orange-600 font-medium">Не призначено</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {driver.assignedVehicle ? (
                                                <div className="flex items-center justify-between group">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">{driver.assignedVehicle.model}</p>
                                                        <p className="text-xs text-slate-500">{driver.assignedVehicle.licensePlate}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedDriver(driver);
                                                            setShowUnassignModal(true);
                                                        }}
                                                        className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Відкріпити"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => openVehicleModal(driver)}
                                                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                                                >
                                                    <Truck className="w-4 h-4" />
                                                    Видати авто
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${driver.status === 'Available' ? 'bg-green-100 text-green-700' :
                                                        driver.status === 'OnTrip' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    {driver.status === 'Available' ? 'Доступний' :
                                                        driver.status === 'OnTrip' ? 'На рейсі' : 'Офлайн'}
                                                </span>
                                                {driver.hasPendingDeletion && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-100 uppercase animate-pulse">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Запит на видалення
                                                    </span>
                                                )}
                                                {driver.hasPendingUpdate && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100 uppercase animate-pulse">
                                                        <Edit className="w-3 h-3" />
                                                        Запит на редагування
                                                    </span>
                                                )}
                                                {!driver.isActive && (
                                                    <span className="text-[10px] text-red-500 font-bold uppercase">Деактивовано</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openAssignModal(driver)}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Призначити менеджера"
                                                >
                                                    <LinkIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(driver)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Редагувати"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedDriver(driver);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    disabled={driver.hasPendingDeletion}
                                                    className={`p-2 rounded-lg transition-colors ${driver.hasPendingDeletion
                                                        ? 'text-slate-300 cursor-not-allowed'
                                                        : 'text-red-600 hover:bg-red-50'
                                                        }`}
                                                    title={driver.hasPendingDeletion ? "Запит вже обробляється" : "Видалити"}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-slate-500">
                                        Водіїв не знайдено
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Driver Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Додати нового водія</h2>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleAddDriver} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ФІО водія</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 placeholder:text-slate-500"
                                        placeholder="Іван Іванов"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 placeholder:text-slate-500"
                                        placeholder="driver@example.com"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                                    <input
                                        required
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 placeholder:text-slate-500"
                                        placeholder="+380..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">№ Посвідчення</label>
                                    <input
                                        type="text"
                                        value={formData.licenseNumber}
                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 placeholder:text-slate-500"
                                        placeholder="ABC 123456"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                    Створити
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Driver Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Редагувати водія</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleEditDriver} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ФІО водія</label>
                                <input
                                    required
                                    type="text"
                                    value={editData.fullName}
                                    onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Телефон</label>
                                    <input
                                        type="tel"
                                        value={editData.phone}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">№ Посвідчення</label>
                                    <input
                                        type="text"
                                        value={editData.licenseNumber}
                                        onChange={(e) => setEditData({ ...editData, licenseNumber: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Статус</label>
                                    <select
                                        value={editData.status}
                                        onChange={(e) => setEditData({ ...editData, status: e.target.value as any })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none bg-white text-slate-900"
                                    >
                                        <option value="Available">Доступний</option>
                                        <option value="OnTrip">На рейсі</option>
                                        <option value="Offline">Офлайн</option>
                                    </select>
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={editData.isActive}
                                            onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
                                        />
                                        <span className="text-sm font-medium text-slate-700">Активний</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                    Зберегти
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedDriver && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Видалити водія?</h2>
                        <p className="text-center text-slate-600 mb-8">
                            Ви збираєтеся видалити водія <span className="font-bold text-slate-900">{selectedDriver.fullName}</span>.
                            Цю дію неможливо буде скасувати.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedDriver(null);
                                }}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleDeleteDriver}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Так, видалити'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Manager Modal */}
            {showAssignModal && selectedDriver && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Призначити менеджера</h2>
                            <button onClick={() => setShowAssignModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-slate-600 mb-4">
                                Виберіть менеджера для водія <span className="font-bold text-slate-900">{selectedDriver.fullName}</span>
                            </p>
                            <select
                                value={selectedManagerId || ''}
                                onChange={(e) => setSelectedManagerId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none bg-white text-slate-900"
                            >
                                <option value="">-- Без менеджера --</option>
                                {managers.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleAssignManager}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Зберегти
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Unassign Vehicle Confirmation Modal */}
            {showUnassignModal && selectedDriver && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Truck className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Відкріпити транспорт?</h2>
                        <p className="text-center text-slate-600 mb-8">
                            Ви впевнені, що хочете відкріпити транспорт від водія <span className="font-bold text-slate-900">{selectedDriver.fullName}</span>?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowUnassignModal(false);
                                    setSelectedDriver(null);
                                }}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleUnassignVehicle}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                Відкріпити
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Vehicle Modal */}
            {showVehicleModal && selectedDriver && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Призначити транспорт</h2>
                            <button onClick={() => setShowVehicleModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-sm text-slate-600 mb-4">
                                Виберіть транспорт для водія <span className="font-bold text-slate-900">{selectedDriver.fullName}</span>
                            </p>
                            <select
                                value={selectedVehicleId || ''}
                                onChange={(e) => setSelectedVehicleId(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-600 outline-none bg-white text-slate-900"
                            >
                                <option value="">-- Оберіть транспорт --</option>
                                {vehicles
                                    .filter(v => !v.assignedDriverId || v.assignedDriverId === selectedDriver.id)
                                    .map((vehicle) => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.model} ({vehicle.licensePlate}) - {vehicle.status}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowVehicleModal(false)}
                                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleAssignVehicle}
                                disabled={isSubmitting || !selectedVehicleId}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                Зберегти
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
