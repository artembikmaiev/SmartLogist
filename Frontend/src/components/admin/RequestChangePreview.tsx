'use client';

import React from 'react';
// Проміжний компонент для попереднього перегляду змін в адміністративних запитах перед їх схваленням.
import { Users, Truck, ArrowRight, FileText } from 'lucide-react';
import { AdminRequest, RequestType } from '@/services/requests.service';
import { safeJsonParse } from '@/lib/utils/json.utils';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { Driver } from '@/types/drivers.types';
import { Vehicle } from '@/types/vehicle.types';

interface RequestChangePreviewProps {
    request: AdminRequest;
    drivers: Driver[];
    vehicles: Vehicle[];
}

export default function RequestChangePreview({ request, drivers, vehicles }: RequestChangePreviewProps) {
    const data = safeJsonParse(request.comment);
    if (!data) return <p className="text-sm text-slate-700 italic">"{request.comment}"</p>;

    const isCreation = request.type === RequestType.DriverCreation ||
        request.type === RequestType.VehicleCreation ||
        String(request.type) === '5' ||
        String(request.type) === '6';

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

    const formatValue = (key: string, val: any) => {
        if (val === null || val === undefined) return '—';
        if (typeof val === 'boolean') return val ? 'Так' : 'Ні';
        if (key.toLowerCase() === 'status') {
            const isDriver = request.type === RequestType.DriverUpdate || request.type === RequestType.DriverCreation || String(request.type) === '2' || String(request.type) === '5';
            return <StatusIndicator status={val} type={isDriver ? 'driver' : 'vehicle'} />;
        }
        return String(val);
    };

    const getCurrentValue = (key: string) => {
        if (isCreation) return null;
        if (data._original) {
            const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
            return data._original[key] ?? data._original[normalizedKey];
        }
        if (!request.targetId) return null;
        const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
        if (request.type === RequestType.DriverUpdate || String(request.type) === '2') {
            const driver = drivers.find(d => d.id === request.targetId);
            return driver ? (driver as any)[normalizedKey] : null;
        }
        if (request.type === RequestType.VehicleUpdate || String(request.type) === '4') {
            const vehicle = vehicles.find(v => v.id === request.targetId);
            return vehicle ? (vehicle as any)[normalizedKey] : null;
        }
        return null;
    };

    const entries = Object.entries(data).filter(([key]) => key !== '_original' && key !== 'id');

    return (
        <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                {isCreation ? 'Дані для створення:' : 'Пропоновані зміни:'}
            </p>
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
                                <span className="text-sm text-slate-700 font-semibold">{formatValue(key, value)}</span>
                            </div>
                        );
                    }

                    if (String(currentVal) === String(value)) return null;

                    return (
                        <div key={key} className="flex flex-col border-l-2 border-blue-200 pl-3 py-1 bg-blue-50/30 rounded-r-lg">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-blue-600/60">{config.icon}</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{config.label}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-slate-400 line-through decoration-slate-300">{formatValue(key, currentVal)}</span>
                                <span className="text-slate-300 text-xs">→</span>
                                <span className="text-sm text-blue-700 font-bold">{formatValue(key, value)}</span>
                            </div>
                        </div>
                    );
                })}
                {entries.length === 0 && <p className="text-sm text-slate-500 italic col-span-full">Змін не виявлено</p>}
            </div>
        </div>
    );
}
