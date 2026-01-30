'use client';

import { Truck, MapPin, Clock, DollarSign, CheckCircle, AlertCircle, RefreshCcw, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { driversService } from '@/services/drivers.service';
import { tripsService } from '@/services/trips.service';
import { DriverStatus, DriverStatusLabels } from '@/types/drivers.types';
import type { Trip, DriverStatsSummary } from '@/types/trip.types';
import { formatDate } from '@/lib/utils/date.utils';

export default function DriverTripsPage() {
    const { user, refreshUser } = useAuth();
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [trips, setTrips] = useState<Trip[]>([]);
    const [statsSummary, setStatsSummary] = useState<DriverStatsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [allTrips, summary] = await Promise.all([
                tripsService.getMyTrips(),
                tripsService.getDriverStats()
            ]);
            setTrips(allTrips);
            setStatsSummary(summary);
        } catch (err) {
            console.error('Failed to fetch trips data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const newTrips = trips.filter(t => t.status === 'Pending');
    const currentTrip = trips.find(t => t.status === 'Accepted' || t.status === 'InTransit');

    const handleStatusUpdate = async (newStatus: DriverStatus) => {
        setIsUpdating(true);
        try {
            await driversService.updateStatusFromDriver(newStatus);
            await refreshUser();
            setIsChangingStatus(false);
        } catch (err: any) {
            console.error('Failed to update status:', err);
            alert(`Не вдалося оновити статус: ${err.message || 'Невідома помилка'}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAcceptTrip = async (id: number) => {
        try {
            await tripsService.acceptTrip(id);
            await fetchData();
        } catch (err: any) {
            alert(`Не вдалося прийняти рейс: ${err.message || 'Невідома помилка'}`);
        }
    };

    const handleDeclineTrip = async (id: number) => {
        try {
            await tripsService.declineTrip(id);
            await fetchData();
        } catch (err: any) {
            alert(`Не вдалося відхилити рейс: ${err.message || 'Невідома помилка'}`);
        }
    };

    const statsCols = [
        { label: 'Поточний рейс', value: statsSummary?.currentTripsCount.toString() || '0', icon: Truck, color: 'blue' },
        { label: 'Завершено', value: statsSummary?.completedTripsCount.toString() || '0', icon: CheckCircle, color: 'green' },
        { label: 'Відстань', value: statsSummary?.totalDistance.toLocaleString() || '0', unit: 'км ' + (statsSummary?.earningsSubtitle || 'цього місяця'), icon: MapPin, color: 'purple' },
        { label: 'Заробіток', value: statsSummary?.totalEarnings.toLocaleString() || '0', unit: (user?.assignedVehicle ? 'грн ' : '$ ') + (statsSummary?.earningsSubtitle || 'цього місяця'), icon: DollarSign, color: 'orange' },
    ];

    return (
        <ProtectedRoute requiredRole="driver">
            <div className="p-8 bg-slate-50 min-h-screen">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Кабінет водія</h1>
                    <p className="text-slate-600 mt-1">{user?.fullName}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCols.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorClasses: Record<string, string> = {
                            blue: 'bg-blue-100 text-blue-600',
                            green: 'bg-green-100 text-green-600',
                            purple: 'bg-purple-100 text-purple-600',
                            orange: 'bg-orange-100 text-orange-600',
                        };
                        return (
                            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:shadow-md">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-2">{stat.label}</p>
                                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                        {stat.unit && <p className="text-xs text-slate-500 mt-1">{stat.unit}</p>}
                                        {(stat as any).subtitle && <p className="text-xs text-green-600 mt-1">{(stat as any).subtitle}</p>}
                                    </div>
                                    <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* New Trip Proposals */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Нові пропозиції рейсів</h2>
                            <div className="space-y-4">
                                {newTrips.length > 0 ? newTrips.map((trip) => (
                                    <div key={trip.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-slate-900">Рейс #{trip.id}</h3>
                                                <p className="text-xs text-slate-500 mt-1">Запропоновано менеджером: {trip.managerName}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Відправлення</p>
                                                <p className="font-semibold text-slate-900">{trip.originCity}, {trip.originAddress}</p>
                                                <p className="text-xs text-slate-600 mt-1">{formatDate(trip.scheduledDeparture)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Прибуття</p>
                                                <p className="font-semibold text-slate-900">{trip.destinationCity}, {trip.destinationAddress}</p>
                                                <p className="text-xs text-slate-600 mt-1">{formatDate(trip.scheduledArrival)}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-slate-500">Відстань</p>
                                                <p className="font-semibold text-slate-900">{trip.distanceKm} км</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Дата</p>
                                                <p className="font-semibold text-slate-900">{formatDate(trip.scheduledDeparture, { day: 'numeric', month: 'short' })}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500">Оплата</p>
                                                <p className="font-semibold text-green-600">{trip.paymentAmount} {trip.currency}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                            <p className="text-xs text-slate-600 mb-1">Запропонована вантажівка:</p>
                                            <p className="font-semibold text-slate-900">{trip.vehicleModel || 'Не вказано'}</p>
                                            <p className="text-sm text-slate-600">Номер: {trip.vehicleLicensePlate || 'Немає даних'}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAcceptTrip(trip.id)}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                Прийняти рейс
                                            </button>
                                            <button
                                                onClick={() => handleDeclineTrip(trip.id)}
                                                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                                            >
                                                Відхилити
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                        <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Немає нових пропозицій</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Current Trip */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Поточний рейс</h2>
                            {currentTrip ? (
                                <div className="border border-green-200 bg-green-50 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-900">Рейс #{currentTrip.id}</h3>
                                        <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                                            {currentTrip.status === 'Accepted' ? 'Прийнято' : 'Виконується'}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500">Відправлення</p>
                                                <p className="font-semibold text-slate-900">{currentTrip.originCity}, {currentTrip.originAddress}</p>
                                                <p className="text-xs text-green-600 mt-1">{currentTrip.actualDeparture ? '✓ Виїхав' : 'Очікує виїзду'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Clock className="w-5 h-5 text-orange-600 mt-1" />
                                            <div className="flex-1">
                                                <p className="text-xs text-slate-500">Прибуття</p>
                                                <p className="font-semibold text-slate-900">{currentTrip.destinationCity}, {currentTrip.destinationAddress}</p>
                                                <p className="text-xs text-orange-600 mt-1">Очікується: {formatDate(currentTrip.scheduledArrival)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                                        Переглянути деталі
                                    </button>
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500 font-medium">Активних рейсів немає</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* My Vehicle */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Моя вантажівка</h2>
                            {user?.assignedVehicle ? (
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <Truck className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{user.assignedVehicle.model}</p>
                                            <p className="text-sm text-slate-600">Номер: {user.assignedVehicle.licensePlate}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200">
                                        <p className="text-xs text-slate-500 mb-1">Наступне ТО</p>
                                        <p className="text-sm font-semibold text-orange-600 italic">Дані про ТО недоступні</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-sm text-slate-500 font-medium">Транспорт не закріплено</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Швидкі дії</h2>
                            <div className="space-y-3">
                                {!isChangingStatus ? (
                                    <>
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="font-semibold text-slate-900 mb-1">Ваш статус</p>
                                            <p className={`text-sm font-medium ${user?.status === 'Available' ? 'text-green-600' : 'text-slate-600'}`}>
                                                {user?.status === 'Available' ? 'Доступний' : (DriverStatusLabels[user?.status as DriverStatus] || user?.status || 'Offline')}
                                            </p>
                                            <p className="text-xs text-slate-600 mt-1">
                                                {user?.status === 'Available' ? 'Готовий до прийняття нових рейсів' : 'Наразі ви не приймаєте замовлення'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsChangingStatus(true)}
                                            className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                                        >
                                            Змінити статус
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        <p className="text-sm font-semibold text-slate-700 mb-2">Оберіть новий статус:</p>
                                        {(Object.keys(DriverStatusLabels) as DriverStatus[]).map((status) => (
                                            <button
                                                key={status}
                                                disabled={isUpdating}
                                                onClick={() => handleStatusUpdate(status)}
                                                className={`w-full px-4 py-2 text-left rounded-lg text-sm font-medium transition-colors border ${user?.status === status
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                                    } flex items-center justify-between`}
                                            >
                                                {DriverStatusLabels[status]}
                                                {isUpdating && user?.status !== status && <RefreshCcw className="w-4 h-4 animate-spin text-slate-400" />}
                                                {user?.status === status && <CheckCircle className="w-4 h-4 text-blue-600" />}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setIsChangingStatus(false)}
                                            className="w-full mt-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium"
                                        >
                                            Скасувати
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Support Links */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Допомога</h2>
                            <div className="space-y-2">
                                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700">Підтримка</a>
                                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700">Документація</a>
                                <a href="#" className="block text-sm text-blue-600 hover:text-blue-700">Конфіденційність</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}