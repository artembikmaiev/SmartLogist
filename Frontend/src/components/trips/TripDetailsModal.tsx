'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { MapPin, Package, Clock, DollarSign, Truck, Navigation, CheckCircle, Play, User, Fuel, Star } from 'lucide-react';
import { Trip } from '@/types/trip.types';
import { formatDate } from '@/lib/utils/date.utils';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('./Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-[32px] flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Завантаження мапи...</div>
});
import Button from '@/components/ui/Button';
const DRIVER_RATE_PER_KM = 7; // грн/км
const BASE_PAYMENT_RATE = 35; // грн/км

const CARGO_SURCHARGES: Record<string, number> = {
    'Standard': 0,
    'Fragile': 0.10,
    'Hazardous': 0.30,
    'Refrigerated': 0.15,
    'Urgent': 0.20,
    'Heavy': 0.10
};

interface TripDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    trip: Trip | null;
    onStatusUpdate: (id: number, status: string, additionalData?: any) => Promise<void>;
    showActions?: boolean;
    isDriverView?: boolean;
}

export default function TripDetailsModal({
    isOpen,
    onClose,
    trip,
    onStatusUpdate,
    showActions = true,
    isDriverView = false
}: TripDetailsModalProps) {
    if (!trip) return null;

    let mapOrigin = { lat: 0, lng: 0, label: trip.originCity };
    let mapDestination = { lat: 0, lng: 0, label: trip.destinationCity };

    if (trip.routeGeometry) {
        try {
            const coords = JSON.parse(trip.routeGeometry);
            if (Array.isArray(coords) && coords.length >= 2) {
                mapOrigin = { lat: coords[0][0], lng: coords[0][1], label: trip.originCity };
                mapDestination = { lat: coords[coords.length - 1][0], lng: coords[coords.length - 1][1], label: trip.destinationCity };
            }
        } catch (e) {
            console.error('Failed to parse geometry for markers', e);
        }
    }

    const [actualConsumption, setActualConsumption] = React.useState<string>('');
    const [rating, setRating] = React.useState<number>(5);
    const [managerReview, setManagerReview] = React.useState<string>('');
    const [isUpdating, setIsUpdating] = React.useState(false);

    const handleAction = async (status: string) => {
        setIsUpdating(true);
        try {
            const data: any = { status };
            if (status === 'Arrived' && actualConsumption) {
                // Handle both dot and comma
                const parsedValue = parseFloat(actualConsumption.replace(',', '.'));
                if (isNaN(parsedValue)) {
                    alert('Будь ласка, введіть коректне число для розходу палива');
                    return;
                }
                data.actualFuelConsumption = parsedValue;
            }
            if (status === 'Completed' && !isDriverView) {
                data.rating = rating;
                data.managerReview = managerReview;
            }
            await onStatusUpdate(trip.id, status, data);
            onClose();
        } catch (error: any) {
            console.error('Failed to update trip status:', error);
            alert(`Помилка оновлення статусу: ${error.message || 'Невідома помилка'}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const statusConfig: Record<string, { label: string, classes: string }> = {
        Pending: { label: 'Очікує', classes: 'bg-amber-500' },
        Accepted: { label: 'Прийнято', classes: 'bg-blue-500' },
        InTransit: { label: 'В дорозі', classes: 'bg-emerald-500 animate-pulse' },
        Arrived: { label: 'Прибув (Очікує підтвердження)', classes: 'bg-indigo-500' },
        Completed: { label: 'Завершено', classes: 'bg-slate-700' },
        Declined: { label: 'Відхилено', classes: 'bg-red-500' },
        Cancelled: { label: 'Скасовано', classes: 'bg-red-500' }
    };

    const config = statusConfig[trip.status] || { label: trip.status, classes: 'bg-slate-500' };

    const surchargePercent = (trip.cargoType && CARGO_SURCHARGES[trip.cargoType]) || 0;
    const basePayout = Math.round(trip.distanceKm * BASE_PAYMENT_RATE);
    const surchargeAmount = Math.round(basePayout * surchargePercent);
    const baseDriverSalary = Math.round(trip.distanceKm * DRIVER_RATE_PER_KM);
    const totalDriverSalary = baseDriverSalary + surchargeAmount;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Деталі рейсу #${trip.id}`}
            maxWidth="5xl"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
                {/* Left Column: Info */}
                <div className="space-y-6">
                    {/* Route Section */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Navigation className="w-4 h-4 text-blue-500" /> Маршрут та час
                        </h3>
                        <div className="space-y-4">
                            <div className="relative pl-6">
                                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-blue-200"></div>
                                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-blue-500 bg-white shadow-sm"></div>
                                <div className="absolute left-0 bottom-1.5 w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-white shadow-sm"></div>

                                <div className="mb-6">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Звідки</p>
                                    <p className="font-bold text-slate-900 leading-tight">{trip.originCity}</p>
                                    <p className="text-sm text-slate-600">{trip.originAddress}</p>
                                    {trip.actualDeparture ? (
                                        <p className="text-xs text-blue-600 mt-1 font-bold italic">Виїзд: {formatDate(trip.actualDeparture)}</p>
                                    ) : (
                                        <p className="text-xs text-blue-600 mt-1 font-medium italic">План: {formatDate(trip.scheduledDeparture)}</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Куди</p>
                                    <p className="font-bold text-slate-900 leading-tight">{trip.destinationCity}</p>
                                    <p className="text-sm text-slate-600">{trip.destinationAddress}</p>
                                    {trip.status === 'Completed' && trip.actualArrival ? (
                                        <p className="text-xs text-slate-900 mt-1 font-black italic">Прибуття: {formatDate(trip.actualArrival)}</p>
                                    ) : (
                                        <p className="text-xs text-emerald-600 mt-1 font-medium italic">Очікується: {formatDate(trip.scheduledArrival)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-700">
                                <span>Відстань:</span>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{trip.distanceKm} км</span>
                            </div>
                        </div>
                    </div>

                    {/* Cargo Section */}
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                        <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Вантаж
                        </h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-white rounded-xl border border-blue-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Назва та тип</p>
                                <p className="font-black text-slate-900">{trip.cargoName || 'Не вказано'}</p>
                                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase tracking-tighter">
                                    {trip.cargoType}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white rounded-xl border border-blue-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Вага</p>
                                    <p className="text-lg font-black text-slate-900">{trip.cargoWeight} <span className="text-xs text-slate-500">т</span></p>
                                </div>
                                <div className="p-3 bg-white rounded-xl border border-blue-100 text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Транспорт</p>
                                    <p className="font-black text-slate-900 truncate">{trip.vehicleModel}</p>
                                    <p className="text-[10px] font-bold text-slate-500">{trip.vehicleLicensePlate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Economics & Actions */}
                    <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl flex flex-col justify-between">
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">
                                        {isDriverView ? 'Ваш заробіток' : 'Загальний бюджет'}
                                    </p>
                                    <div className="text-3xl font-black text-white flex items-center gap-1">
                                        <span className="text-emerald-400">₴</span> {isDriverView ? (trip.driverEarnings || totalDriverSalary).toLocaleString() : trip.paymentAmount.toLocaleString()}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded text-[10px] font-black uppercase ${config.classes}`}>
                                    {config.label}
                                </div>
                            </div>

                            {!isDriverView && (
                                <>
                                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                                        <div>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Виплата водія (на руки)</p>
                                            <div className="text-lg font-black text-blue-400 flex items-center gap-1.5">
                                                <User className="w-4 h-4" /> {totalDriverSalary.toLocaleString()} ₴
                                            </div>
                                            {surchargeAmount > 0 && (
                                                <p className="text-[9px] text-blue-400/60 font-bold">
                                                    Вкл. надбавку: +{surchargeAmount.toLocaleString()} ₴
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                                                {trip.actualFuelConsumption ? 'Витрати на пальне (факт)' : 'Витрати на пальне (план)'}
                                            </p>
                                            <div className="text-lg font-black text-orange-400 flex items-center justify-end gap-1.5">
                                                <Fuel className="w-4 h-4" /> {(trip.estimatedFuelCost || 0).toLocaleString()} ₴
                                            </div>
                                            {trip.actualFuelConsumption && (
                                                <p className="text-[9px] text-orange-400/60 font-bold">
                                                    Розхід: {trip.actualFuelConsumption} л/100км
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Чистий профіт компанії</p>
                                        <div className={`text-xl font-black flex items-center gap-1.5 ${(trip.expectedProfit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {(trip.expectedProfit || 0).toLocaleString()} ₴
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {trip.status === 'Completed' && trip.rating && (
                            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Оцінка менеджера</p>
                                <div className="flex gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= (trip.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                                        />
                                    ))}
                                </div>
                                {trip.managerReview && (
                                    <p className="text-sm text-slate-300 italic">"{trip.managerReview}"</p>
                                )}
                            </div>
                        )}

                        {showActions && (
                            <div className="space-y-3">
                                {trip.status === 'Accepted' && isDriverView && (
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 py-4 h-auto font-black flex items-center justify-center gap-2"
                                        onClick={() => handleAction('InTransit')}
                                        isLoading={isUpdating}
                                        icon={<Play className="w-5 h-5 fill-current" />}
                                    >
                                        РОЗПОЧАТИ РЕЙС
                                    </Button>
                                )}
                                {trip.status === 'InTransit' && isDriverView && (
                                    <div className="space-y-3">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Реальний розхід (л/100км)</p>
                                            <div className="relative">
                                                <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    inputMode="decimal"
                                                    placeholder="Напр. 28.5"
                                                    value={actualConsumption}
                                                    onChange={(e) => setActualConsumption(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                />
                                            </div>
                                            <p className="text-[9px] text-slate-400 mt-2 italic">* Введіть розхід для перерахунку вартості палива</p>
                                        </div>
                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 h-auto font-black flex items-center justify-center gap-2"
                                            onClick={() => handleAction('Arrived')}
                                            disabled={!actualConsumption || isUpdating}
                                            isLoading={isUpdating}
                                            icon={<CheckCircle className="w-5 h-5" />}
                                        >
                                            ЗАВЕРШИТИ РЕЙС (ПРИБУВ)
                                        </Button>
                                    </div>
                                )}
                                {trip.status === 'Arrived' && !isDriverView && (
                                    <div className="space-y-4">
                                        <div className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Оцінка та відгук менеджера</p>

                                            {/* Stars */}
                                            <div className="flex gap-1 mb-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="focus:outline-none transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24"
                                                placeholder="Залиште відгук про виконання рейсу (необов'язково)..."
                                                value={managerReview}
                                                onChange={(e) => setManagerReview(e.target.value)}
                                            />
                                        </div>

                                        <Button
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 h-auto font-black flex items-center justify-center gap-2"
                                            onClick={() => handleAction('Completed')}
                                            isLoading={isUpdating}
                                            icon={<CheckCircle className="w-5 h-5" />}
                                        >
                                            ПІДТВЕРДИТИ ЗАВЕРШЕННЯ
                                        </Button>
                                    </div>
                                )}
                                {trip.status === 'Arrived' && isDriverView && (
                                    <div className="bg-emerald-100/10 p-4 rounded-xl border border-emerald-500/20 text-center">
                                        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                        <p className="text-sm font-bold text-emerald-400 uppercase">Рейс завершено (Прибув)</p>
                                        <p className="text-[10px] text-slate-400 mt-1 italic">Очікуйте підтвердження менеджером для остаточного розрахунку</p>
                                    </div>
                                )}
                                {trip.status === 'InTransit' && !isDriverView && (
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Рейс виконується водієм</p>
                                        <p className="text-[10px] text-slate-500 mt-1">Кнопка завершення з'явиться після прибуття водія</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Map */}
                <div className="flex flex-col h-full min-h-[500px] border border-slate-200 rounded-[32px] overflow-hidden">
                    <Map
                        origin={mapOrigin}
                        destination={mapDestination}
                        onMapClick={() => { }}
                        onRouteInfo={() => { }}
                        height="100%"
                        initialRouteGeometry={trip.routeGeometry}
                    />
                </div>
            </div>
        </Modal>
    );
}
