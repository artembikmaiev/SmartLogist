'use client';

import { Truck, MapPin, Clock, DollarSign, CheckCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { driversService } from '@/services/drivers.service';
import { DriverStatus, DriverStatusLabels } from '@/types/drivers.types';
import { formatDate } from '@/lib/utils/date.utils';
import TripDetailsModal from '@/components/trips/TripDetailsModal';
import StatCard from '@/components/ui/StatCard';
import { useTrips } from '@/hooks/useTrips';

export default function DriverTripsPage() {
    const { user, refreshUser } = useAuth();
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        allItems: trips,
        driverStats: stats,
        isLoading,
        selectedItem: selectedTrip,
        setSelectedItem: setSelectedTrip,
        loadData: fetchData,
        updateTripStatus,
        acceptTrip,
        declineTrip
    } = useTrips('driver');

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const newTrips = trips.filter(t => t.status === 'Pending');
    const currentTrip = trips.find(t => ['Accepted', 'InTransit', 'Arrived'].includes(t.status));

    const handleStatusUpdate = async (newStatus: DriverStatus) => {
        setIsUpdating(true);
        try {
            await driversService.updateStatusFromDriver(newStatus);
            await refreshUser();
            setIsChangingStatus(false);
        } catch (err: any) {
            alert(`Не вдалося оновити статус: ${err.message || 'Помилка'}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleViewDetails = (trip: any) => {
        setSelectedTrip(trip);
        setIsDetailsOpen(true);
    };

    return (
        <ProtectedRoute requiredRole="driver">
            <div className="p-8 bg-slate-50 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Кабінет водія</h1>
                    <p className="text-slate-600 mt-1">{user?.fullName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Поточний рейс" value={stats?.currentTripsCount.toString() || '0'} icon={Truck} color="blue" />
                    <StatCard title="Завершено" value={stats?.completedTripsCount.toString() || '0'} icon={CheckCircle} color="green" />
                    <StatCard
                        title="Відстань"
                        value={stats?.totalDistance.toLocaleString() || '0'}
                        subtitle={stats?.earningsSubtitle || 'цього місяця'}
                        unit="км"
                        icon={MapPin}
                        color="purple"
                    />
                    <StatCard
                        title="Заробіток"
                        value={stats?.totalEarnings.toLocaleString() || '0'}
                        subtitle={stats?.earningsSubtitle || 'цього місяця'}
                        unit={user?.assignedVehicle ? '₴' : '$'}
                        icon={DollarSign}
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Нові пропозиції рейсів</h2>
                            <div className="space-y-4">
                                {newTrips.length > 0 ? newTrips.map((trip) => (
                                    <div key={trip.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-slate-900">Рейс #{trip.id}</h3>
                                            <p className="text-xs text-slate-500 mt-1">Від: {trip.managerName}</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Відправлення</p>
                                                <p className="font-semibold text-slate-900 text-sm">{trip.originCity}</p>
                                                <p className="text-[10px] text-slate-500">{formatDate(trip.scheduledDeparture)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 mb-1">Прибуття</p>
                                                <p className="font-semibold text-slate-900 text-sm">{trip.destinationCity}</p>
                                                <p className="text-[10px] text-slate-500">{formatDate(trip.scheduledArrival)}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-slate-50 rounded-lg text-center">
                                            <div>
                                                <p className="text-[10px] text-slate-500">Відстань</p>
                                                <p className="font-bold text-slate-900 text-sm">{trip.distanceKm} км</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Оплата</p>
                                                <p className="font-bold text-green-600 text-sm">{trip.driverEarnings?.toLocaleString()} ₴</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-500">Вантаж</p>
                                                <p className="font-bold text-blue-600 text-sm">{trip.cargoWeight} т</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button onClick={() => acceptTrip(trip.id)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">Прийняти</button>
                                            <button onClick={() => declineTrip(trip.id)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 text-sm">Відхилити</button>
                                            <button onClick={() => handleViewDetails(trip)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 text-sm">Деталі</button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                        <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm">Немає нових пропозицій</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Поточний рейс</h2>
                            {currentTrip ? (
                                <div className="border border-green-100 bg-green-50/50 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-slate-900">Рейс #{currentTrip.id}</h3>
                                        <span className="px-2 py-1 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{currentTrip.status}</span>
                                    </div>
                                    <div className="space-y-3 mb-4 text-sm">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                                            <div>
                                                <p className="text-[10px] text-slate-500">Відправлення: {currentTrip.originCity}</p>
                                                <p className="font-bold text-slate-900">{currentTrip.originAddress}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Clock className="w-4 h-4 text-blue-600 mt-1" />
                                            <div>
                                                <p className="text-[10px] text-slate-500">Очікуване прибуття: {currentTrip.destinationCity}</p>
                                                <p className="font-bold text-slate-900">{formatDate(currentTrip.scheduledArrival)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => handleViewDetails(currentTrip)} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">Керувати рейсом</button>
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400">Активних рейсів немає</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Транспорт</h2>
                            {user?.assignedVehicle ? (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"><Truck className="w-5 h-5 text-white" /></div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900">{user.assignedVehicle.model}</p>
                                            <p className="text-[10px] font-bold text-slate-500">{user.assignedVehicle.licensePlate}</p>
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Технічний стан</p>
                                        <p className={`text-xs font-bold ${user.assignedVehicle.kmUntilMaintenance < 1000 ? 'text-red-500' : 'text-orange-500'}`}>До ТО: {Math.round(user.assignedVehicle.kmUntilMaintenance).toLocaleString()} км</p>
                                    </div>
                                </div>
                            ) : <p className="text-sm text-slate-400 italic">Не закріплено</p>}
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Статус</h2>
                            <div className="space-y-3">
                                {!isChangingStatus ? (
                                    <>
                                        <div className={`p-3 rounded-xl border ${user?.status === 'Available' ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Поточний стан</p>
                                            <p className={`text-sm font-bold ${user?.status === 'Available' ? 'text-green-600' : 'text-slate-600'}`}>{DriverStatusLabels[user?.status as DriverStatus] || user?.status}</p>
                                        </div>
                                        <button onClick={() => setIsChangingStatus(true)} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">Змінити статус</button>
                                    </>
                                ) : (
                                    <div className="space-y-2">
                                        {(Object.keys(DriverStatusLabels) as DriverStatus[]).map((s) => (
                                            <button key={s} disabled={isUpdating} onClick={() => handleStatusUpdate(s)} className={`w-full p-2.5 text-left rounded-xl text-xs font-bold border transition-all ${user?.status === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{DriverStatusLabels[s]}</button>
                                        ))}
                                        <button onClick={() => setIsChangingStatus(false)} className="w-full py-2 text-xs text-slate-400 font-bold hover:text-slate-600 transition-colors">Скасувати</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <TripDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} trip={selectedTrip} onStatusUpdate={(id, s, d) => updateTripStatus(id, s, d)} isDriverView={true} />
            </div>
        </ProtectedRoute>
    );
}