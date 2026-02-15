'use client';

// Універсальний компонент форми для управління даними водіїв та їх документами.
import React from 'react';
import { Driver, DriverStatus } from '@/types/drivers.types';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface DriverFormProps {
    driver?: Driver;
    onSubmit: (data: any) => Promise<boolean>;
    onCancel: () => void;
    error?: string;
    isAdmin?: boolean;
}

export default function DriverForm({ driver, onSubmit, onCancel, error, isAdmin }: DriverFormProps) {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = {
            fullName: formData.get('fullName') as string,
            phone: formData.get('phone') as string || undefined,
            licenseNumber: formData.get('licenseNumber') as string || undefined,
        };

        if (driver) {
            data.status = formData.get('status') as DriverStatus;
            data.isActive = formData.get('isActive') === 'true';
        } else {
            data.email = formData.get('email') as string;
            data.password = formData.get('password') as string;
        }

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <FormField label="Повне ім'я" required id="fullName">
                <Input
                    id="fullName"
                    name="fullName"
                    required
                    defaultValue={driver?.fullName}
                    placeholder="Іван Петренко"
                />
            </FormField>

            {!driver && (
                <>
                    <FormField label="Email" required id="email">
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            placeholder="driver@smartlogist.ua"
                        />
                    </FormField>

                    <FormField label="Пароль" required id="password">
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                            minLength={8}
                            placeholder="Мінімум 8 символів"
                        />
                    </FormField>
                </>
            )}

            <div className="grid grid-cols-2 gap-4">
                <FormField label="Телефон" id="phone" hint="Формат: +380XXXXXXXXX">
                    <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        defaultValue={driver?.phone}
                        placeholder="+380XXXXXXXXX"
                    />
                </FormField>
                <FormField label="Посвідчення" id="licenseNumber">
                    <Input
                        id="licenseNumber"
                        type="text"
                        name="licenseNumber"
                        defaultValue={driver?.licenseNumber}
                        placeholder="ABC123456"
                    />
                </FormField>
            </div>

            {driver && (
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Статус" id="status">
                        <Select
                            id="status"
                            name="status"
                            defaultValue={driver.status}
                            options={[
                                { value: 'Available', label: 'Вільний' },
                                { value: 'OnTrip', label: 'На маршруті' },
                                { value: 'OnBreak', label: 'На перерві' },
                                { value: 'Offline', label: 'Офлайн' },
                            ]}
                        />
                    </FormField>
                    <FormField label="Активний" id="isActive">
                        <Select
                            id="isActive"
                            name="isActive"
                            defaultValue={driver.isActive ? 'true' : 'false'}
                            options={[
                                { value: 'true', label: 'Так' },
                                { value: 'false', label: 'Ні' },
                            ]}
                        />
                    </FormField>
                </div>
            )}

            <div className="flex gap-3 mt-6">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    type="button"
                    className="flex-1"
                >
                    Скасувати
                </Button>
                <Button
                    type="submit"
                    variant="purple"
                    className="flex-1"
                >
                    {driver ? 'Зберегти зміни' : 'Додати водія'}
                </Button>
            </div>
        </form>
    );
}
