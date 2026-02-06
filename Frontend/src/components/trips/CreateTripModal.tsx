"use client";

import { useState, useEffect, useMemo } from 'react';
import { MapPin, Truck, User as UserIcon, Calendar, Clock, Navigation, Package, DollarSign, Fuel, Briefcase, AlertCircle } from 'lucide-react';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Map } from './index';
import { tripsService } from '@/services/trips.service';
import { driversService } from '@/services/drivers.service';
import { vehiclesService } from '@/services/vehicles.service';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Driver } from '@/types/drivers.types';
import type { Vehicle } from '@/types/vehicle.types';
import { debounce } from 'lodash';

interface CreateTripModalProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const FUEL_PRICE = 58; // грн/літр (дизель Україна)
const DRIVER_RATE_PER_KM = 7; // грн/км (заробіток водія)
const BASE_PAYMENT_RATE = 35; // грн/км (ринкова ставка)

// Помічник для форматування дати у локальний рядок ISO для datetime-local
const toLocalISOString = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export enum CargoType {
    Standard = 0,
    Fragile = 1,
    Hazardous = 2,
    Refrigerated = 3,
    Urgent = 4,
    Heavy = 5
}

const SURCHARGES: Record<number, number> = {
    [CargoType.Standard]: 0,
    [CargoType.Fragile]: 0.10,
    [CargoType.Hazardous]: 0.30,
    [CargoType.Refrigerated]: 0.15,
    [CargoType.Urgent]: 0.20,
    [CargoType.Heavy]: 0.10
};

export default function CreateTripModal({ onSuccess, onCancel }: CreateTripModalProps) {
    const { success, error } = useNotifications();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    const [formData, setFormData] = useState({
        originCity: '',
        originAddress: '',
        originLatitude: undefined as number | undefined,
        originLongitude: undefined as number | undefined,
        destinationCity: '',
        destinationAddress: '',
        destinationLatitude: undefined as number | undefined,
        destinationLongitude: undefined as number | undefined,
        scheduledDeparture: '',
        scheduledArrival: '',
        paymentAmount: 0,
        currency: 'UAH',
        distanceKm: 0,
        driverId: 0,
        vehicleId: 0 as number | undefined,
        notes: '',
        // ETS info
        cargoName: '',
        cargoType: CargoType.Standard,
        cargoWeight: 0,
        routeGeometry: ''
    });

    const [mapPoints, setMapPoints] = useState<{
        origin?: { lat: number; lng: number; label: string };
        destination?: { lat: number; lng: number; label: string };
    }>({});
    const [selectingType, setSelectingType] = useState<'origin' | 'destination'>('origin');
    const [lastRouteDuration, setLastRouteDuration] = useState<number>(0);
    const [routingError, setRoutingError] = useState<string | null>(null);

    // Розрахунок прибутковості
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    const fuelCost = Math.round((formData.distanceKm * (selectedVehicle?.fuelConsumption || 0) / 100) * FUEL_PRICE);
    const baseDriverSalary = Math.round(formData.distanceKm * DRIVER_RATE_PER_KM);

    // Розрахунок надбавки за тип вантажу
    const cargoSurchargePercent = SURCHARGES[formData.cargoType] || 0;
    const basePayout = Math.round(formData.distanceKm * BASE_PAYMENT_RATE);
    const surchargeAmount = Math.round(basePayout * cargoSurchargePercent);

    const driverSalary = baseDriverSalary + surchargeAmount;
    const expectedProfit = formData.paymentAmount - fuelCost - driverSalary;

    useEffect(() => {
        fetchDriversAndVehicles();
    }, []);

    useEffect(() => {
        if (formData.scheduledDeparture && lastRouteDuration > 0) {
            const departureDate = new Date(formData.scheduledDeparture);
            if (!isNaN(departureDate.getTime())) {
                const arrivalDate = new Date(departureDate.getTime() + (lastRouteDuration + 60) * 60000);
                const localArrival = toLocalISOString(arrivalDate);
                if (localArrival !== formData.scheduledArrival) {
                    setFormData(prev => ({ ...prev, scheduledArrival: localArrival }));
                }
            }
        }
    }, [formData.scheduledDeparture, lastRouteDuration]);

    const fetchDriversAndVehicles = async () => {
        try {
            const driversData = await (driversService as any).getAll();
            const vehiclesData = await (vehiclesService as any).getAll();
            setDrivers(Array.isArray(driversData) ? driversData : []);
            setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
        } catch (err) {
            console.error('Failed to load drivers/vehicles', err);
        }
    };

    const geocode = async (address: string, type: 'origin' | 'destination') => {
        if (!address || address.length < 5) return;
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
                { headers: { 'Accept-Language': 'uk,en' } }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            if (data && data.length > 0) {
                const point = {
                    lat: parseFloat(data[0].lat),
                    lng: parseFloat(data[0].lon),
                    label: address
                };
                setMapPoints(prev => ({ ...prev, [type]: point }));
            }
        } catch (err) {
            console.error('Geocoding failed', err);
            error('Не вдалося знайти координати.');
        }
    };

    const debouncedGeocode = debounce(geocode, 1000);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'originAddress' | 'destinationAddress') => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
        const cityField = field === 'originAddress' ? 'originCity' : 'destinationCity';
        const fullAddress = `${formData[cityField as keyof typeof formData]}, ${value}`;
        debouncedGeocode(fullAddress, field === 'originAddress' ? 'origin' : 'destination');
    };

    const handleMapClick = async (lat: number, lng: number) => {
        debouncedGeocode.cancel();
        const type = selectingType;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                { headers: { 'Accept-Language': 'uk,en' } }
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const city = data.address?.city || data.address?.town || data.address?.village || '';
            const address = data.display_name?.split(',').slice(0, 2).join(',').trim() || '';

            if (type === 'origin') {
                setFormData(prev => ({
                    ...prev,
                    originCity: city,
                    originAddress: address,
                    originLatitude: lat,
                    originLongitude: lng
                }));
                setMapPoints(prev => ({ ...prev, origin: { lat, lng, label: address } }));
                setSelectingType('destination');
            } else {
                setFormData(prev => ({
                    ...prev,
                    destinationCity: city,
                    destinationAddress: address,
                    destinationLatitude: lat,
                    destinationLongitude: lng
                }));
                setMapPoints(prev => ({ ...prev, destination: { lat, lng, label: address } }));
            }
        } catch (err) {
            console.error('Reverse geocoding failed', err);
        }
    };

    const handleRouteInfo = (distanceKm: number, durationMinutes: number, geometry: any) => {
        setLastRouteDuration(durationMinutes);
        if (distanceKm === 0 && (mapPoints.origin && mapPoints.destination)) {
            setRoutingError('Неможливо прокласти вантажний маршрут для цих точок');
        } else {
            setRoutingError(null);
        }

        const base = Math.round(distanceKm * BASE_PAYMENT_RATE);
        const surcharge = SURCHARGES[formData.cargoType] || 0;
        const totalSuggested = Math.round(base * (1 + surcharge));

        setFormData(prev => ({
            ...prev,
            distanceKm,
            routeGeometry: JSON.stringify(geometry),
            paymentAmount: prev.paymentAmount === 0 ? totalSuggested : prev.paymentAmount
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.driverId === 0) {
            error('Будь ласка, оберіть водія');
            return;
        }

        setIsSubmitting(true);
        try {
            await tripsService.createTrip({
                ...formData,
                scheduledDeparture: new Date(formData.scheduledDeparture).toISOString(),
                scheduledArrival: new Date(formData.scheduledArrival).toISOString(),
                expectedProfit,
                estimatedFuelCost: fuelCost,
                originLatitude: mapPoints.origin?.lat,
                originLongitude: mapPoints.origin?.lng,
                destinationLatitude: mapPoints.destination?.lat,
                destinationLongitude: mapPoints.destination?.lng
            });
            success('Рейс успішно створено');
            onSuccess();
        } catch (err: any) {
            error(`Помилка: ${err.message || 'Не вдалося створити рейс'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
                <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
                    {/* Точки маршруту */}
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Маршрут
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Місто відправлення">
                                <Input
                                    value={formData.originCity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, originCity: e.target.value }))}
                                    required
                                />
                            </FormField>
                            <FormField label="Адреса відправлення">
                                <Input
                                    value={formData.originAddress}
                                    onChange={(e) => handleAddressChange(e, 'originAddress')}
                                    onFocus={() => setSelectingType('origin')}
                                    className={selectingType === 'origin' ? 'ring-2 ring-blue-500' : ''}
                                    required
                                />
                            </FormField>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Місто прибуття">
                                <Input
                                    value={formData.destinationCity}
                                    onChange={(e) => setFormData(prev => ({ ...prev, destinationCity: e.target.value }))}
                                    required
                                />
                            </FormField>
                            <FormField label="Адреса прибуття">
                                <Input
                                    value={formData.destinationAddress}
                                    onChange={(e) => handleAddressChange(e, 'destinationAddress')}
                                    onFocus={() => setSelectingType('destination')}
                                    className={selectingType === 'destination' ? 'ring-2 ring-blue-500' : ''}
                                    required
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* Вантаж (ETS Style) */}
                    <div className="bg-blue-50/50 p-4 rounded-xl space-y-4 border border-blue-100/50">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                            <Package className="w-3 h-3" /> Вантаж (Cargo)
                        </h3>
                        <FormField label="Назва вантажу">
                            <Input
                                value={formData.cargoName}
                                onChange={(e) => setFormData(prev => ({ ...prev, cargoName: e.target.value }))}
                                placeholder="Напр: Електроніка, Продукти"
                                required
                            />
                        </FormField>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Тип вантажу">
                                <select
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900"
                                    value={formData.cargoType}
                                    onChange={(e) => {
                                        const newType = parseInt(e.target.value);
                                        const surcharge = SURCHARGES[newType] || 0;
                                        setFormData(prev => ({
                                            ...prev,
                                            cargoType: newType,
                                            // Оновлюємо суму якщо вона була розрахована автоматично
                                            paymentAmount: Math.round((prev.distanceKm * BASE_PAYMENT_RATE) * (1 + surcharge))
                                        }));
                                    }}
                                >
                                    <option value={CargoType.Standard}>Стандартний</option>
                                    <option value={CargoType.Fragile}>Крихкий</option>
                                    <option value={CargoType.Hazardous}>Небезпечний (ADR)</option>
                                    <option value={CargoType.Refrigerated}>Рефрижератор</option>
                                    <option value={CargoType.Urgent}>Терміновий</option>
                                    <option value={CargoType.Heavy}>Важкий</option>
                                </select>
                            </FormField>
                            <FormField label="Вага (тон)">
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={formData.cargoWeight}
                                    onChange={(e) => setFormData(prev => ({ ...prev, cargoWeight: parseFloat(e.target.value) }))}
                                    required
                                />
                            </FormField>
                        </div>
                    </div>

                    {/* Вибір виконавців */}
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Водій">
                            <select
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                                value={formData.driverId}
                                onChange={(e) => {
                                    const id = parseInt(e.target.value);
                                    const driver = drivers.find(d => d.id === id);
                                    setFormData(prev => ({
                                        ...prev,
                                        driverId: id,
                                        vehicleId: driver?.assignedVehicle?.vehicleId || prev.vehicleId
                                    }));
                                }}
                                required
                            >
                                <option value="0">Оберіть...</option>
                                {drivers.map(d => (
                                    <option key={d.id} value={d.id}>{d.fullName}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField label="Транспорт">
                            <select
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900"
                                value={formData.vehicleId || 0}
                                onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: parseInt(e.target.value) || undefined }))}
                            >
                                <option value="0">Оберіть...</option>
                                {vehicles.map(v => (
                                    <option key={v.id} value={v.id}>{v.model} ({v.licensePlate})</option>
                                ))}
                            </select>
                        </FormField>
                    </div>

                    {/* Економіка (ETS Strategy) */}
                    <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4 shadow-xl border border-slate-700">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Briefcase className="w-3 h-3 text-blue-400" /> ДЕТАЛІ ТА ЕКОНОМІКА РЕЙСУ
                            </h3>
                            <div className="flex gap-2">
                                {formData.distanceKm > 0 && (
                                    <div className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 flex items-center gap-1 font-bold">
                                        <Navigation className="w-3 h-3" /> {formData.distanceKm} км
                                    </div>
                                )}
                                {routingError && (
                                    <div className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Маршрут не прокладено
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/50">
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block text-left">Ставка за рейс (Виплата)</label>
                                <div className="flex items-center">
                                    <DollarSign className="w-5 h-5 text-emerald-400 mr-2" />
                                    <input
                                        type="number"
                                        value={formData.paymentAmount}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentAmount: parseFloat(e.target.value) }))}
                                        className="bg-transparent border-none text-white font-black text-2xl p-0 h-auto focus:ring-0 w-full"
                                    />
                                    <span className="text-slate-500 font-bold ml-2">UAH</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 px-1">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter block text-left">Витрати на пальне</span>
                                    <div className="flex items-center gap-1.5 text-orange-400 font-black text-sm">
                                        <Fuel className="w-3.5 h-3.5" /> {fuelCost.toLocaleString()} ₴
                                    </div>
                                    <div className="text-[9px] text-slate-600">~{((formData.distanceKm * (selectedVehicle?.fuelConsumption || 0) / 100)).toFixed(1)} л</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter block text-left">Заробіток водія</span>
                                    <div className="flex items-center gap-1.5 text-blue-400 font-black text-sm">
                                        <UserIcon className="w-3.5 h-3.5" /> {driverSalary.toLocaleString()} ₴
                                    </div>
                                    <div className="text-[9px] text-slate-600">
                                        {DRIVER_RATE_PER_KM} ₴/км
                                        {surchargeAmount > 0 && ` + надбавка (${(cargoSurchargePercent * 100).toFixed(0)}%)`}
                                    </div>
                                </div>
                            </div>

                            {cargoSurchargePercent > 0 && (
                                <div className="bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg flex justify-between items-center mx-1">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">Надбавка за тип вантажу (+{(cargoSurchargePercent * 100).toFixed(0)}%)</span>
                                    <span className="text-xs font-black text-blue-300">+{surchargeAmount.toLocaleString()} ₴</span>
                                </div>
                            )}

                            <div className={`mt-2 p-4 rounded-xl flex justify-between items-center transition-all ${expectedProfit >= 0 ? 'bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-red-500/10 border border-red-500/30'}`}>
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-0.5 text-left">Чистий профіт</span>
                                    <div className={`text-3xl font-black tracking-tight ${expectedProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {expectedProfit.toLocaleString()} <span className="text-sm">₴</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs font-black px-2 py-1 rounded ${expectedProfit >= 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {formData.paymentAmount > 0 ? ((expectedProfit / formData.paymentAmount) * 100).toFixed(0) : 0}% ROI
                                    </div>
                                    <div className="text-[9px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Efficiency</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-full">
                    {/* Дати та час */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <FormField label="Дата виїзду">
                            <Input
                                type="datetime-local"
                                value={formData.scheduledDeparture}
                                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDeparture: e.target.value }))}
                                required
                            />
                        </FormField>
                        <FormField label="Прибуття (прогноз)">
                            <Input
                                type="datetime-local"
                                value={formData.scheduledArrival}
                                readOnly
                                className="bg-slate-50 text-blue-600 font-medium"
                            />
                        </FormField>
                    </div>

                    <div className="flex-1 min-h-[400px]">
                        <Map
                            origin={mapPoints.origin}
                            destination={mapPoints.destination}
                            onMapClick={handleMapClick}
                            onRouteInfo={handleRouteInfo}
                            height="100%"
                            vehicleDimensions={useMemo(() => selectedVehicle ? {
                                height: selectedVehicle.height,
                                width: selectedVehicle.width,
                                length: selectedVehicle.length,
                                weight: selectedVehicle.weight,
                                isHazardous: selectedVehicle.isHazardous
                            } : undefined, [selectedVehicle?.id, selectedVehicle?.height, selectedVehicle?.width, selectedVehicle?.length, selectedVehicle?.weight, selectedVehicle?.isHazardous])}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>Скасувати</Button>
                <Button type="submit" isLoading={isSubmitting} className="px-8">Створити рейс</Button>
            </div>
        </form>
    );
}
