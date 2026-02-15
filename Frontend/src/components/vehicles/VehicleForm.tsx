'use client';

// Спеціалізована форма для внесення технічних характеристик транспортних засобів у систему.
import React from 'react';
import { Truck, AlertCircle, Clock } from 'lucide-react';
import { Vehicle, VehicleStatus } from '@/types/vehicle.types';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface VehicleFormProps {
    vehicle?: Vehicle;
    onSubmit: (data: any) => Promise<boolean>;
    onCancel: () => void;
    error?: string;
}

export default function VehicleForm({ vehicle, onSubmit, onCancel, error }: VehicleFormProps) {
    const isEdit = !!vehicle;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            model: formData.get('model') as string,
            licensePlate: formData.get('licensePlate') as string,
            type: formData.get('type') as string,
            fuelType: formData.get('fuelType') as string,
            fuelConsumption: Number(formData.get('fuelConsumption')),
            height: Number(formData.get('height')),
            width: Number(formData.get('width')),
            length: Number(formData.get('length')),
            weight: Number(formData.get('weight')),
            isHazardous: formData.get('isHazardous') === 'on',
            status: isEdit ? (formData.get('status') as VehicleStatus) : VehicleStatus.Available,
            totalMileage: Number(formData.get('totalMileage')),
            mileageAtLastMaintenance: Number(formData.get('mileageAtLastMaintenance')),
        };

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Марка та модель" required id="model" className="col-span-2">
                    <Input
                        id="model"
                        name="model"
                        required
                        defaultValue={vehicle?.model}
                        placeholder="Mercedes-Benz Sprinter"
                    />
                </FormField>

                <FormField label="Номерний знак" required id="licensePlate">
                    <Input
                        id="licensePlate"
                        name="licensePlate"
                        required
                        defaultValue={vehicle?.licensePlate}
                        placeholder="AA1234BB"
                    />
                </FormField>

                <FormField label="Тип транспорту" required id="type">
                    <Select
                        id="type"
                        name="type"
                        required
                        defaultValue={vehicle?.type || 'Вантажівка'}
                        options={[
                            { value: 'Вантажівка', label: 'Вантажівка' },
                            { value: 'Фургон', label: 'Фургон' },
                        ]}
                    />
                </FormField>

                <FormField label="Тип палива" required id="fuelType">
                    <Select
                        id="fuelType"
                        name="fuelType"
                        required
                        defaultValue={vehicle?.fuelType || 'Дизель'}
                        options={[
                            { value: 'Дизель', label: 'Дизель' },
                            { value: 'Бензин', label: 'Бензин' },
                            { value: 'Електро', label: 'Електро' },
                        ]}
                    />
                </FormField>

                <FormField label="Витрата палива (л/100км)" required id="fuelConsumption">
                    <Input
                        id="fuelConsumption"
                        type="number"
                        name="fuelConsumption"
                        step="0.1"
                        required
                        defaultValue={vehicle?.fuelConsumption}
                        placeholder="12.5"
                    />
                </FormField>

                <div className="col-span-2 border-t pt-4 mt-2">
                    <h3 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-500" />
                        Фізичні параметри (для маршрутизації)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="Висота (м)" id="height">
                            <Input
                                id="height"
                                type="number"
                                name="height"
                                step="0.01"
                                defaultValue={vehicle?.height}
                                placeholder="3.5"
                            />
                        </FormField>
                        <FormField label="Ширина (м)" id="width">
                            <Input
                                id="width"
                                type="number"
                                name="width"
                                step="0.01"
                                defaultValue={vehicle?.width}
                                placeholder="2.5"
                            />
                        </FormField>
                        <FormField label="Довжина (м)" id="length">
                            <Input
                                id="length"
                                type="number"
                                name="length"
                                step="0.01"
                                defaultValue={vehicle?.length}
                                placeholder="8.0"
                            />
                        </FormField>
                        <FormField label="Вага (т)" id="weight">
                            <Input
                                id="weight"
                                type="number"
                                name="weight"
                                step="0.1"
                                defaultValue={vehicle?.weight}
                                placeholder="12.0"
                            />
                        </FormField>
                        <div className="col-span-2 flex items-center gap-2 py-2">
                            <input
                                type="checkbox"
                                id="isHazardous"
                                name="isHazardous"
                                defaultChecked={vehicle?.isHazardous}
                                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                            />
                            <label htmlFor="isHazardous" className="text-sm text-slate-700 select-none">
                                Небезпечний вантаж (ADR)
                            </label>
                        </div>
                    </div>
                </div>

                {isEdit && (
                    <FormField label="Статус" id="status" className="col-span-2">
                        <Select
                            id="status"
                            name="status"
                            defaultValue={vehicle?.status}
                            options={[
                                { value: VehicleStatus.Available, label: 'Вільний' },
                                { value: VehicleStatus.InUse, label: 'На маршруті' },
                                { value: VehicleStatus.Maintenance, label: 'В ремонті' },
                                { value: VehicleStatus.Inactive, label: 'Офлайн' },
                            ]}
                        />
                    </FormField>
                )}
            </div>

            <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Інформація про пробіг (км)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Загальний пробіг" id="totalMileage">
                        <Input
                            id="totalMileage"
                            type="number"
                            name="totalMileage"
                            defaultValue={vehicle?.totalMileage || 0}
                            placeholder="50000"
                        />
                    </FormField>
                    <FormField label="Пробіг при останньому ТО" id="mileageAtLastMaintenance">
                        <Input
                            id="mileageAtLastMaintenance"
                            type="number"
                            name="mileageAtLastMaintenance"
                            defaultValue={vehicle?.mileageAtLastMaintenance || 0}
                            placeholder="45000"
                        />
                    </FormField>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={onCancel} className="flex-1">Скасувати</Button>
                <Button type="submit" variant="purple" className="flex-1">{isEdit ? 'Зберегти зміни' : 'Додати транспорт'}</Button>
            </div>
        </form>
    );
}
