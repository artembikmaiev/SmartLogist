'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Truck,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Wrench,
    ChevronDown,
    Loader2,
    X,
    RotateCcw,
    User,
} from 'lucide-react';
import { vehiclesService } from '@/services/vehicles.service';
import type { Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleType, FuelType, VehicleStatus } from '@/types/vehicle.types';

export default function AdminVehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    // Form data
    const [formData, setFormData] = useState<CreateVehicleDto>({
        model: '',
        licensePlate: '',
        type: 'Truck' as VehicleType,
        fuelType: 'Diesel' as FuelType,
        fuelConsumption: 0,
        status: 'Available' as VehicleStatus
    });

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const data = await vehiclesService.getAllAdmin();
            setVehicles(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Помилка при завантаженні транспорту');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            await vehiclesService.createAdmin(formData);
            setShowCreateModal(false);
            resetForm();
            await loadVehicles();
        } catch (err: any) {
            alert(err.message || 'Помилка при створенні');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicle) return;
        try {
            setIsSubmitting(true);
            await vehiclesService.updateAdmin(selectedVehicle.id, formData);
            setShowEditModal(false);
            setSelectedVehicle(null);
            resetForm();
            await loadVehicles();
        } catch (err: any) {
            alert(err.message || 'Помилка при оновленні');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedVehicle) return;
        try {
            setIsSubmitting(true);
            await vehiclesService.deleteAdmin(selectedVehicle.id);
            setShowDeleteModal(false);
            setSelectedVehicle(null);
            await loadVehicles();
        } catch (err: any) {
            alert(err.message || 'Помилка при видаленні');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            model: '',
            licensePlate: '',
            type: 'Truck',
            fuelType: 'Diesel',
            fuelConsumption: 0,
            status: 'Available'
        });
    };

    const filteredVehicles = useMemo(() => {
        return vehicles.filter(v => {
            const matchesSearch =
                v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || v.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [vehicles, searchQuery, statusFilter]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-700 border-green-200';
            case 'InUse': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Available': return <CheckCircle2 className="w-4 h-4" />;
            case 'InUse': return <Truck className="w-4 h-4" />;
            case 'Maintenance': return <Wrench className="w-4 h-4" />;
            default: return <Truck className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Завантаження автопарку...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Управління автопарком</h1>
                    <p className="text-slate-600 mt-1">Перегляд та керування всіма транспортними засобами компанії</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadVehicles}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                        title="Оновити"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowCreateModal(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        Додати транспорт
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Пошук за моделлю або номером..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative min-w-[180px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none appearance-none text-slate-900 cursor-pointer"
                        >
                            <option value="all">Усі статуси</option>
                            <option value="Available">Доступний</option>
                            <option value="InUse">В дорозі</option>
                            <option value="Maintenance">ТО</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Vehicles Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Транспорт</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Тип / Паливо</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Витрати</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Статус</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Водій</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredVehicles.length > 0 ? (
                                filteredVehicles.map((v) => (
                                    <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
                                                    <Truck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{v.model}</div>
                                                    <div className="text-xs text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded w-fit mt-1">{v.licensePlate}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900">{v.type}</div>
                                            <div className="text-xs text-slate-500">{v.fuelType}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{v.fuelConsumption} л/100км</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(v.status)}`}>
                                                    {getStatusIcon(v.status)}
                                                    {v.status === 'Available' ? 'Доступний' : v.status === 'InUse' ? 'В дорозі' : 'ТО'}
                                                </span>

                                                {v.hasPendingDeletion && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100 uppercase">
                                                        <AlertCircle className="w-3 h-3" />
                                                        Запит на видалення
                                                    </span>
                                                )}
                                                {v.hasPendingUpdate && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded border border-blue-100 uppercase">
                                                        <Edit className="w-3 h-3" />
                                                        Запит на редагування
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {v.assignedDriverName ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                        {v.assignedDriverName.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-sm text-slate-700 font-medium">{v.assignedDriverName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Не призначено</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedVehicle(v);
                                                        setFormData({
                                                            model: v.model,
                                                            licensePlate: v.licensePlate,
                                                            type: v.type,
                                                            fuelType: v.fuelType,
                                                            fuelConsumption: v.fuelConsumption,
                                                            status: v.status
                                                        });
                                                        setShowEditModal(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Редагувати"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedVehicle(v);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Видалити"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                                        Транспорту не знайдено
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || showEditModal) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 font-sans">
                                {showCreateModal ? 'Додати транспорт' : 'Редагувати транспорт'}
                            </h2>
                            <button onClick={() => { setShowCreateModal(false); setShowEditModal(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={showCreateModal ? handleCreate : handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Модель</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 transition-all"
                                        placeholder="Наприклад: Volvo FH16"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Держ. номер</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.licensePlate}
                                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 transition-all"
                                        placeholder="AA 1234 BB"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Тип</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as VehicleType })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 transition-all cursor-pointer"
                                    >
                                        <option value="Truck">Вантажівка</option>
                                        <option value="Van">Фургон</option>
                                        <option value="Semi">Тягач</option>
                                        <option value="Refrigerated">Рефрижератор</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Тип палива</label>
                                    <select
                                        value={formData.fuelType}
                                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as FuelType })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 transition-all cursor-pointer"
                                    >
                                        <option value="Diesel">Дизель</option>
                                        <option value="Gasoline">Бензин</option>
                                        <option value="Gas">Газ</option>
                                        <option value="Electric">Електро</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Витрати (л/100км)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formData.fuelConsumption}
                                        onChange={(e) => setFormData({ ...formData, fuelConsumption: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 transition-all"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Статус</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(['Available', 'InUse', 'Maintenance'] as VehicleStatus[]).map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, status })}
                                                className={`py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all ${formData.status === status
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                                                    }`}
                                            >
                                                {status === 'Available' ? 'Доступний' : status === 'InUse' ? 'В дорозі' : 'ТО'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => { setShowCreateModal(false); setShowEditModal(false); }}
                                    className="flex-1 py-4 px-6 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all"
                                >
                                    Скасувати
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-purple-100 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                                    {showCreateModal ? 'Створити' : 'Зберегти'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedVehicle && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-600">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Видалити транспорт?</h2>
                            <p className="text-slate-500 text-sm mb-8">
                                Ви впевнені, що хочете видалити <strong>{selectedVehicle.model}</strong>? Цю дію неможливо скасувати.
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    Так, видалити
                                </button>
                                <button
                                    onClick={() => { setShowDeleteModal(false); setSelectedVehicle(null); }}
                                    className="w-full py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-all"
                                >
                                    Скасувати
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
