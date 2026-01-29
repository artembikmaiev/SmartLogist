'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Bell,
    Check,
    X,
    Clock,
    User,
    MessageSquare,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    UserMinus,
    ChevronDown,
    MoreHorizontal,
    RotateCcw,
    Trash2,
    Truck,
    Edit,
    Users
} from 'lucide-react';
import { requestsService, AdminRequest, RequestStatus, RequestType } from '@/services/requests.service';
import { driversService } from '@/services/drivers.service';
import { vehiclesService } from '@/services/vehicles.service';
import { Driver } from '@/types/drivers.types';
import { Vehicle } from '@/types/vehicle.types';

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<AdminRequest[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal state
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
    const [processData, setProcessData] = useState({
        approved: true,
        response: ''
    });

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const [reqData, driversData, vehiclesData] = await Promise.all([
                requestsService.getAll(),
                driversService.getAllAdmin(),
                vehiclesService.getAllAdmin()
            ]);
            setRequests(reqData);
            setDrivers(driversData);
            setVehicles(vehiclesData);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Помилка при завантаженні даних');
        } finally {
            setLoading(false);
        }
    };

    const handleClearProcessed = async () => {
        try {
            setLoading(true);
            await requestsService.clearProcessed();
            await loadRequests();
            setShowClearConfirmModal(false);
        } catch (err: any) {
            setError(err.message || 'Помилка при видаленні оброблених запитів');
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch =
                req.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                req.comment.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [requests, searchQuery, statusFilter]);

    const handleProcessRequest = async () => {
        if (!selectedRequest) return;

        try {
            setIsSubmitting(true);
            await requestsService.processRequest(selectedRequest.id, {
                approved: processData.approved,
                response: processData.response
            });
            setSelectedRequest(null);
            setProcessData({ approved: true, response: '' });
            await loadRequests();
        } catch (err: any) {
            alert(err.message || 'Помилка при обробці запиту');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusStyle = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.Pending:
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case RequestStatus.Approved:
                return 'bg-green-100 text-green-700 border-green-200';
            case RequestStatus.Rejected:
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusLabel = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.Pending: return 'Очікує';
            case RequestStatus.Approved: return 'Схвалено';
            case RequestStatus.Rejected: return 'Відхилено';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Завантаження запитів...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Запити на розгляд</h1>
                    <p className="text-slate-600 mt-1">Керування запитами від менеджерів на делікатні операції</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                        <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Очікують</div>
                        <div className="text-2xl font-bold text-amber-600">
                            {requests.filter(r => r.status === RequestStatus.Pending).length}
                        </div>
                    </div>
                    <button
                        onClick={loadRequests}
                        className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Оновити"
                    >
                        <RotateCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    {requests.some(r => r.status !== RequestStatus.Pending) && (
                        <button
                            onClick={() => setShowClearConfirmModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-lg transition-all font-medium text-sm"
                            title="Очистити історію"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:inline">Очистити історію</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Пошук за водієм, менеджером або коментарем..."
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
                            <option value={RequestStatus.Pending}>Очікують</option>
                            <option value={RequestStatus.Approved}>Схвалені</option>
                            <option value={RequestStatus.Rejected}>Відхилені</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Requests Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col"
                        >
                            <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold border-b border-l rounded-bl-xl ${getStatusStyle(request.status)}`}>
                                {getStatusLabel(request.status)}
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                {request.type === RequestType.DriverDeletion ? (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-sm h-fit">
                                        <UserMinus className="w-6 h-6" />
                                    </div>
                                ) : request.type === RequestType.DriverUpdate ? (
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm h-fit">
                                        <Edit className="w-6 h-6" />
                                    </div>
                                ) : request.type === RequestType.VehicleDeletion ? (
                                    <div className="p-3 bg-red-50 text-red-600 rounded-xl shadow-sm h-fit">
                                        <Trash2 className="w-6 h-6" />
                                    </div>
                                ) : request.type === RequestType.VehicleUpdate ? (
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm h-fit">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shadow-sm h-fit">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <div className="text-xs text-slate-500 font-bold uppercase mb-1">
                                        {request.type === RequestType.DriverDeletion ? 'Видалення водія' :
                                            request.type === RequestType.DriverUpdate ? 'Оновлення водія' :
                                                request.type === RequestType.DriverCreation ? 'Додавання водія' :
                                                    request.type === RequestType.VehicleDeletion ? 'Видалення транспорту' :
                                                        request.type === RequestType.VehicleCreation ? 'Додавання транспорту' :
                                                            request.type === RequestType.VehicleUpdate ? 'Оновлення транспорту' : 'Запит'}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                        {request.targetName}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                                        <User className="w-4 h-4" />
                                        <span>від: <span className="font-semibold text-slate-900">{request.requesterName}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4 mb-6 flex-grow">
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="w-4 h-4 text-slate-400 mt-1" />
                                    <div className="w-full">
                                        {(request.type === RequestType.DriverUpdate ||
                                            request.type === RequestType.VehicleUpdate ||
                                            request.type === RequestType.DriverCreation ||
                                            request.type === RequestType.VehicleCreation ||
                                            String(request.type) === '2' ||
                                            String(request.type) === '4' ||
                                            String(request.type) === '5' ||
                                            String(request.type) === '6') ? (
                                            <div className="space-y-2">
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                                                    {(request.type === RequestType.DriverCreation || request.type === RequestType.VehicleCreation || String(request.type) === '5' || String(request.type) === '6')
                                                        ? 'Дані для створення:'
                                                        : 'Пропоновані зміни:'}
                                                </p>
                                                {(() => {
                                                    try {
                                                        let data = JSON.parse(request.comment);
                                                        if (typeof data === 'string') {
                                                            try {
                                                                data = JSON.parse(data);
                                                            } catch { /* ignore */ }
                                                        }

                                                        const isCreation = (request.type === RequestType.DriverCreation || request.type === RequestType.VehicleCreation || String(request.type) === '5' || String(request.type) === '6');

                                                        // Helper to get current value
                                                        const getCurrentValue = (key: string) => {
                                                            if (isCreation) return null;

                                                            // Prioritize original data from the request itself (snapshot)
                                                            if (data._original) {
                                                                const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
                                                                // Find in original data by checking both cases
                                                                return data._original[key] ?? data._original[normalizedKey];
                                                            }

                                                            if (!request.targetId) return null;

                                                            const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);

                                                            if (request.type === RequestType.DriverUpdate || String(request.type) === '2') {
                                                                const driver = drivers.find(d => d.id === request.targetId);
                                                                if (!driver) return null;

                                                                // Driver mappings
                                                                if (normalizedKey === 'status') return driver.status;
                                                                return (driver as any)[normalizedKey];
                                                            }

                                                            if (request.type === RequestType.VehicleUpdate || String(request.type) === '4') {
                                                                const vehicle = vehicles.find(v => v.id === request.targetId);
                                                                if (!vehicle) return null;

                                                                // Vehicle mappings
                                                                if (normalizedKey === 'status') return vehicle.status;
                                                                return (vehicle as any)[normalizedKey];
                                                            }

                                                            return null;
                                                        };

                                                        const labelMap: Record<string, { label: string; icon?: React.ReactNode }> = {
                                                            fullName: { label: 'ПІБ', icon: <Users className="w-3 h-3" /> },
                                                            FullName: { label: 'ПІБ', icon: <Users className="w-3 h-3" /> },
                                                            phone: { label: 'Телефон', icon: <Users className="w-3 h-3" /> },
                                                            Phone: { label: 'Телефон', icon: <Users className="w-3 h-3" /> },
                                                            email: { label: 'Email', icon: <Users className="w-3 h-3" /> },
                                                            Email: { label: 'Email', icon: <Users className="w-3 h-3" /> },
                                                            password: { label: 'Пароль', icon: <Users className="w-3 h-3" /> },
                                                            Password: { label: 'Пароль', icon: <Users className="w-3 h-3" /> },
                                                            licenseNumber: { label: 'Номер посвідчення', icon: <Users className="w-3 h-3" /> },
                                                            LicenseNumber: { label: 'Номер посвідчення', icon: <Users className="w-3 h-3" /> },
                                                            status: { label: 'Статус', icon: <Users className="w-3 h-3" /> },
                                                            Status: { label: 'Статус', icon: <Users className="w-3 h-3" /> },
                                                            isActive: { label: 'Активність', icon: <Users className="w-3 h-3" /> },
                                                            IsActive: { label: 'Активність', icon: <Users className="w-3 h-3" /> },
                                                            model: { label: 'Модель', icon: <Truck className="w-3 h-3" /> },
                                                            Model: { label: 'Модель', icon: <Truck className="w-3 h-3" /> },
                                                            licensePlate: { label: 'Номер авто', icon: <Truck className="w-3 h-3" /> },
                                                            LicensePlate: { label: 'Номер авто', icon: <Truck className="w-3 h-3" /> },
                                                            type: { label: 'Тип транспорту', icon: <Truck className="w-3 h-3" /> },
                                                            Type: { label: 'Тип транспорту', icon: <Truck className="w-3 h-3" /> },
                                                            fuelType: { label: 'Тип палива', icon: <Truck className="w-3 h-3" /> },
                                                            FuelType: { label: 'Тип палива', icon: <Truck className="w-3 h-3" /> },
                                                            fuelConsumption: { label: 'Витрати (л/100км)', icon: <Truck className="w-3 h-3" /> },
                                                            FuelConsumption: { label: 'Витрати (л/100км)', icon: <Truck className="w-3 h-3" /> }
                                                        };

                                                        // Helper to format values
                                                        const formatValue = (key: string, val: any) => {
                                                            if (val === null || val === undefined) return '—';
                                                            if (typeof val === 'boolean') return val ? 'Так' : 'Ні';

                                                            if (key.toLowerCase() === 'status') {
                                                                const isDriver = request.type === RequestType.DriverUpdate || request.type === RequestType.DriverCreation || String(request.type) === '2' || String(request.type) === '5';
                                                                const statuses: Record<string, string> = isDriver ? {
                                                                    '1': 'Доступний', 'Available': 'Доступний',
                                                                    '2': 'На рейсі', 'OnTrip': 'На рейсі',
                                                                    '3': 'Офлайн', 'Offline': 'Офлайн',
                                                                    '4': 'Перерва', 'OnBreak': 'Перерва'
                                                                } : {
                                                                    '1': 'Доступний', 'Available': 'Доступний',
                                                                    '2': 'В дорозі', 'InUse': 'В дорозі',
                                                                    '3': 'Обслуговування', 'Maintenance': 'Обслуговування',
                                                                    '4': 'Неактивний', 'Inactive': 'Неактивний'
                                                                };
                                                                return statuses[String(val)] || String(val);
                                                            }
                                                            return String(val);
                                                        };

                                                        const entries = Object.entries(data).filter(([key]) => key !== '_original' && key !== 'id');

                                                        return (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                                                {entries.map(([key, value]) => {
                                                                    if (value === null || value === undefined) return null;

                                                                    const currentVal = getCurrentValue(key);
                                                                    const config = labelMap[key] || { label: key };

                                                                    if (isCreation) {
                                                                        return (
                                                                            <div key={key} className="flex flex-col border-l-2 border-green-200 pl-3 py-1 bg-green-50/30 rounded-r-lg">
                                                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                                                    <span className="text-green-600/60">{config.icon}</span>
                                                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{config.label}</span>
                                                                                </div>
                                                                                <span className="text-sm text-slate-700 font-semibold">
                                                                                    {formatValue(key, value)}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    // For updates, only show if changed
                                                                    if (String(currentVal) === String(value)) return null;

                                                                    return (
                                                                        <div key={key} className="flex flex-col border-l-2 border-blue-200 pl-3 py-1 bg-blue-50/30 rounded-r-lg">
                                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                                <span className="text-blue-600/60">{config.icon}</span>
                                                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{config.label}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                                <span className="text-sm text-slate-400 line-through decoration-slate-300">
                                                                                    {formatValue(key, currentVal)}
                                                                                </span>
                                                                                <span className="text-slate-300 text-xs">→</span>
                                                                                <span className="text-sm text-blue-700 font-bold">
                                                                                    {formatValue(key, value)}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {entries.length === 0 && (
                                                                    <p className="text-sm text-slate-500 italic col-span-full">Змін не виявлено</p>
                                                                )}
                                                            </div>
                                                        );
                                                    } catch (e) {
                                                        return <p className="text-sm text-slate-700 italic">"{request.comment}"</p>;
                                                    }
                                                })()}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-700 italic">"{request.comment}"</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                        {(() => {
                                            // Handle various date formats and ensure UTC-to-Local conversion
                                            let dateString = request.createdAt;
                                            if (!dateString.endsWith('Z') && !dateString.includes('+')) {
                                                dateString += 'Z';
                                            }
                                            const date = new Date(dateString);
                                            return `${date.toLocaleDateString()} o ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                                        })()}
                                    </span>
                                </div>

                                {request.status === RequestStatus.Pending && (
                                    <button
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setShowProcessModal(true);
                                        }}
                                        className="bg-purple-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-100"
                                    >
                                        Розглянути
                                    </button>
                                )}
                            </div>

                            {request.status !== RequestStatus.Pending && request.adminResponse && (
                                <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Відповідь адміністратора</div>
                                    <p className="text-sm text-slate-600 font-medium">{request.adminResponse}</p>
                                    <div className="text-[10px] text-slate-400 mt-1 italic">Оброблено: {request.processedBy}</div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500">
                        <Bell className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-lg font-medium">Запитів не знайдено</p>
                        <p className="text-sm">Спробуйте змінити фільтри або пошуковий запит</p>
                    </div>
                )}
            </div>

            {/* Process Modal */}
            {showProcessModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 font-sans">Розгляд запиту</h2>
                            <button onClick={() => setShowProcessModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className={`p-3 bg-white rounded-xl shadow-sm h-fit ${selectedRequest.type === RequestType.DriverDeletion || selectedRequest.type === RequestType.VehicleDeletion ? 'text-red-600' : 'text-blue-600'}`}>
                                    {selectedRequest.type === RequestType.DriverDeletion ? <UserMinus className="w-6 h-6" /> :
                                        selectedRequest.type === RequestType.DriverUpdate ? <Edit className="w-6 h-6" /> :
                                            selectedRequest.type === RequestType.VehicleDeletion ? <Trash2 className="w-6 h-6" /> :
                                                selectedRequest.type === RequestType.VehicleUpdate ? <Truck className="w-6 h-6" /> :
                                                    <Bell className="w-6 h-6" />}
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Мета запиту</div>
                                    <div className="text-lg font-bold text-slate-900 leading-tight">
                                        {selectedRequest.type === RequestType.DriverDeletion ? 'Видалення водія: ' :
                                            selectedRequest.type === RequestType.DriverUpdate ? 'Оновлення водія: ' :
                                                selectedRequest.type === RequestType.VehicleDeletion ? 'Видалення транспорту: ' :
                                                    selectedRequest.type === RequestType.VehicleUpdate ? 'Оновлення транспорту: ' : 'Запит: '}
                                        {selectedRequest.targetName}
                                    </div>
                                    <div className="text-sm text-slate-600 mt-1">Відправник: {selectedRequest.requesterName}</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Рішення</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setProcessData({ ...processData, approved: true })}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${processData.approved
                                            ? 'bg-green-50 border-green-500 text-green-700'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        <Check className="w-5 h-5" />
                                        Схвалити
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProcessData({ ...processData, approved: false })}
                                        className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${!processData.approved
                                            ? 'bg-red-50 border-red-500 text-red-700'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        <X className="w-5 h-5" />
                                        Відхилити
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Коментар до відповіді</label>
                                <textarea
                                    value={processData.response}
                                    onChange={(e) => setProcessData({ ...processData, response: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-600 outline-none text-slate-900 h-24 resize-none transition-all placeholder:text-slate-400"
                                    placeholder="Поясніть причину вашого рішення..."
                                ></textarea>
                            </div>

                            <button
                                onClick={handleProcessRequest}
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${processData.approved
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-100'
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-100'
                                    }`}
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                                Підтвердити рішення
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear History Confirmation Modal */}
            {showClearConfirmModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Очистити історію?</h2>
                            <p className="text-slate-500 text-sm mb-8">
                                Ви впевнені, що хочете видалити всю історію оброблених запитів? Цю дію неможливо скасувати.
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={handleClearProcessed}
                                    disabled={loading}
                                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-100 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    Так, видалити все
                                </button>
                                <button
                                    onClick={() => setShowClearConfirmModal(false)}
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
