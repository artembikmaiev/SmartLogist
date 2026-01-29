import React from 'react';
import { Truck, AlertCircle } from 'lucide-react';
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
            status: isEdit ? (formData.get('status') as VehicleStatus) : VehicleStatus.Available,
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

            <div className="flex gap-3 mt-6">
                <Button variant="secondary" onClick={onCancel} className="flex-1">Скасувати</Button>
                <Button type="submit" className="flex-1">{isEdit ? 'Зберегти зміни' : 'Додати транспорт'}</Button>
            </div>
        </form>
    );
}
