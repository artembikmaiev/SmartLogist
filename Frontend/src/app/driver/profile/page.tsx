'use client';

import { User, Mail, Phone, Calendar, Award, Edit, Save, X, Truck, MapPin, Clock, DollarSign, CheckCircle, Info, RefreshCcw, Trash2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { activitiesService } from '@/services/activities.service';
import type { ActivityLog } from '@/types/activity.types';
import { formatDate } from '@/lib/utils/date.utils';
import { driversService } from '@/services/drivers.service';
import { DriverStatus, DriverStatusLabels } from '@/types/drivers.types';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { externalService, RoadCondition } from '@/services/external.service';

export default function DriverProfilePage() {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [roadConditions, setRoadConditions] = useState<RoadCondition[]>([]);
    const [isLoadingRoads, setIsLoadingRoads] = useState(true);
    const [roadsUpdatedAt, setRoadsUpdatedAt] = useState<Date>(new Date());
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');

    // Initialize form states when user data is available
    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setPhone(user.phone || '');
            setLicenseNumber(user.licenseNumber || '');
        }
    }, [user]);

    // Fetch activities
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const data = await activitiesService.getRecent(3);
                setActivities(data);
            } catch (err) {
                console.error('Failed to fetch activities:', err);
            } finally {
                setIsLoadingActivities(false);
            }
        };

        const fetchRoadConditions = async () => {
            try {
                const data = await externalService.getRoadConditions();
                setRoadConditions(data);
                setRoadsUpdatedAt(new Date());
            } catch (err) {
                console.error('Failed to fetch road conditions:', err);
            } finally {
                setIsLoadingRoads(false);
            }
        };

        fetchActivities();
        fetchRoadConditions();
    }, []);

    const handleStatusUpdate = async (newStatus: DriverStatus) => {
        setIsUpdatingStatus(true);
        try {
            await driversService.updateStatusFromDriver(newStatus);
            await refreshUser();
            setIsChangingStatus(false);
            // Refresh activities too
            const data = await activitiesService.getRecent(3);
            setActivities(data);
        } catch (err: any) {
            console.error('Failed to update status:', err);
            alert(`Не вдалося оновити статус: ${err.message || 'Невідома помилка'}`);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            await driversService.updateProfileFromDriver({
                fullName,
                phone,
                licenseNumber
            });
            await refreshUser();
            setIsEditing(false);
            // Refresh activities too
            const data = await activitiesService.getRecent(3);
            setActivities(data);
        } catch (err: any) {
            console.error('Failed to save profile:', err);
            alert(`Не вдалося зберегти профіль: ${err.message || 'Невідома помилка'}`);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const getActivityIcon = (action: string) => {
        if (action.includes('Завершено') || action.includes('Успішно')) return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (action.includes('Створено') || action.includes('Додано')) return <RefreshCcw className="w-5 h-5 text-blue-500" />;
        if (action.includes('Оновлено') || action.includes('Змінено')) return <Info className="w-5 h-5 text-blue-400" />;
        if (action.includes('Видалено') || action.includes('Відхилено')) return <Trash2 className="w-5 h-5 text-red-500" />;
        if (action.includes('Призначено') || action.includes('Транспорт')) return <Truck className="w-5 h-5 text-purple-500" />;
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    };

    return (
        <ProtectedRoute requiredRole="driver">
            <div className="p-8 bg-slate-50 min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
                            <p className="text-slate-500 text-sm mt-1">Персональна інформація та налаштування облікового запису</p>
                        </div>
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 h-12 gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                Редагувати профіль
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSaveProfile}
                                    isLoading={isSavingProfile}
                                    className="bg-green-600 hover:bg-green-700 px-6 py-3 h-12 gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Зберегти
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        // Reset to original values
                                        setFullName(user?.fullName || '');
                                        setPhone(user?.phone || '');
                                        setLicenseNumber(user?.licenseNumber || '');
                                    }}
                                    disabled={isSavingProfile}
                                    className="px-6 py-3 h-12 gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    Скасувати
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Особиста інформація</h2>

                            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-3xl">
                                        {user?.fullName ? getInitials(user.fullName) : '??'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{user?.fullName}</h3>
                                    <p className="text-slate-600">Водій-далекобійник</p>
                                    <div className="flex items-center gap-2 mt-2 relative">
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsChangingStatus(!isChangingStatus)}
                                                disabled={isUpdatingStatus}
                                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all shadow-sm border ${user?.status === 'Available'
                                                    ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                                                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {isUpdatingStatus ? (
                                                    <RefreshCcw className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    DriverStatusLabels[user?.status as DriverStatus] || user?.status || 'Offline'
                                                )}
                                                <ChevronDown className={`w-3 h-3 transition-transform ${isChangingStatus ? 'rotate-180' : ''}`} />
                                            </button>

                                            {isChangingStatus && (
                                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                                                    {(Object.keys(DriverStatusLabels) as DriverStatus[]).map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => handleStatusUpdate(status)}
                                                            className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between ${user?.status === status ? 'text-blue-600 font-semibold bg-blue-50/50' : 'text-slate-700'
                                                                }`}
                                                        >
                                                            {DriverStatusLabels[status]}
                                                            {user?.status === status && <CheckCircle2 className="w-4 h-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
                                            Водій
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Повне ім'я" id="fullName">
                                    {isEditing ? (
                                        <Input
                                            id="fullName"
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    ) : (
                                        <p className="font-semibold text-slate-900">{user?.fullName}</p>
                                    )}
                                </FormField>

                                <FormField label="Email" id="email">
                                    <p className="font-semibold text-slate-900">{user?.email}</p>
                                </FormField>

                                <FormField label="Телефон" id="phone">
                                    {isEditing ? (
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    ) : (
                                        <p className="font-semibold text-slate-900">{user?.phone || '—'}</p>
                                    )}
                                </FormField>

                                <FormField label="Посвідчення водія" id="license">
                                    {isEditing ? (
                                        <Input
                                            id="license"
                                            type="text"
                                            value={licenseNumber}
                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                        />
                                    ) : (
                                        <p className="font-semibold text-slate-900">{user?.licenseNumber || '—'}</p>
                                    )}
                                </FormField>

                                <FormField label="Дата прийняття" id="hiredAt">
                                    <p className="font-semibold text-slate-900">{formatDate(user?.createdAt)}</p>
                                </FormField>

                                <FormField label="Закріплений транспорт" id="vehicle">
                                    {user?.assignedVehicle ? (
                                        <p className="font-semibold text-slate-900">
                                            {user.assignedVehicle.model} ({user.assignedVehicle.licensePlate})
                                        </p>
                                    ) : (
                                        <p className="font-semibold text-slate-500 italic">Не закріплено</p>
                                    )}
                                </FormField>
                            </div>
                        </div>

                        {/* Security Settings */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Безпека</h2>

                            <div className="space-y-5">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-slate-900">Пароль</p>
                                        <p className="text-sm text-slate-500 mt-1">Останнє оновлення: 2 місяці тому</p>
                                    </div>
                                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                        Змінити пароль
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-slate-900">Двофакторна автентифікація</p>
                                        <p className="text-sm text-slate-500 mt-1">Додатковий захист облікового запису</p>
                                    </div>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                        Увімкнути
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-slate-900">Активні сесії</p>
                                        <p className="text-sm text-slate-500 mt-1">1 пристрій підключений</p>
                                    </div>
                                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                        Переглянути
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-slate-900">Email для відновлення</p>
                                        <p className="text-sm text-slate-500 mt-1">ivan.petrenko@smartlogist.ua</p>
                                    </div>
                                    <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                                        Змінити
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Остання активність</h2>
                            <div className="space-y-4">
                                {isLoadingActivities ? (
                                    <div className="flex justify-center p-4">
                                        <RefreshCcw className="w-5 h-5 text-slate-400 animate-spin" />
                                    </div>
                                ) : activities.length > 0 ? (
                                    activities.map((activity) => (
                                        <div key={activity.id} className="flex gap-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {getActivityIcon(activity.action)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 text-sm">{activity.action}</p>
                                                <p className="text-xs text-slate-600 truncate">{activity.details}</p>
                                                <p className="text-xs text-slate-400 mt-1">{formatDate(activity.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">Активності відсутні</p>
                                )}
                            </div>
                        </div>

                        {/* Road Conditions */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900">Погода в хабах</h2>
                                <span className="text-xs text-slate-400">Оновлено {roadsUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="space-y-3">
                                {isLoadingRoads ? (
                                    <div className="flex justify-center p-4">
                                        <RefreshCcw className="w-5 h-5 text-slate-400 animate-spin" />
                                    </div>
                                ) : roadConditions.length > 0 ? (
                                    roadConditions.map((road, idx) => (
                                        <div key={idx} className={`flex items-center justify-between p-3 border rounded-lg ${road.statusColor === 'green' ? 'bg-green-50 border-green-200' :
                                            road.statusColor === 'orange' ? 'bg-orange-50 border-orange-200' :
                                                'bg-blue-50 border-blue-200'
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${road.statusColor === 'green' ? 'from-green-500 to-green-600' :
                                                    road.statusColor === 'orange' ? 'from-orange-500 to-orange-600' :
                                                        'from-blue-500 to-blue-600'
                                                    }`}>
                                                    <span className="text-white font-bold text-lg">{road.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{road.route}</p>
                                                    <p className="text-xs text-slate-600">{road.roadName}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${road.statusColor === 'green' ? 'text-green-700' :
                                                    road.statusColor === 'orange' ? 'text-orange-700' :
                                                        'text-blue-700'
                                                    }`}>{road.condition}</p>
                                                <p className="text-xs text-slate-600">{road.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 text-center py-4">Дані про дороги відсутні</p>
                                )}
                            </div>
                        </div>

                        {/* Notifications Settings */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Сповіщення</h2>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-slate-700">Email сповіщення</span>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-slate-700">SMS сповіщення</span>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm text-slate-700">Push сповіщення</span>
                                    <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-600" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}