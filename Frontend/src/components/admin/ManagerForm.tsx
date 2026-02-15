'use client';

// Спеціалізована форма для створення та оновлення облікових записів менеджерів адміністратором.
import React from 'react';
import { Manager } from '@/services/managers.service';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';

interface ManagerFormProps {
    manager?: Manager | null;
    onSubmit: (data: any) => Promise<boolean>;
    onCancel: () => void;
}

export default function ManagerForm({ manager, onSubmit, onCancel }: ManagerFormProps) {
    const isEdit = !!manager;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: any = {
            fullName: formData.get('fullName') as string,
            phone: formData.get('phone') as string,
        };

        if (isEdit) {
            data.isActive = formData.get('isActive') === 'on';
        } else {
            data.email = formData.get('email') as string;
            data.password = formData.get('password') as string;
        }

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="ФІО" required id="fullName">
                <Input
                    required
                    id="fullName"
                    name="fullName"
                    type="text"
                    defaultValue={manager?.fullName}
                    placeholder="Іван Іванов"
                />
            </FormField>

            {!isEdit && (
                <>
                    <FormField label="Email" required id="email">
                        <Input
                            required
                            id="email"
                            name="email"
                            type="email"
                            placeholder="manager@example.com"
                        />
                    </FormField>
                    <FormField label="Пароль" required id="password">
                        <Input
                            required
                            id="password"
                            name="password"
                            type="password"
                            minLength={8}
                            placeholder="••••••••"
                        />
                    </FormField>
                </>
            )}

            <FormField label="Телефон" id="phone" hint="Формат: +380XXXXXXXXX">
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={manager?.phone || ''}
                    placeholder="+380..."
                />
            </FormField>

            {isEdit && (
                <div className="flex items-center gap-2 py-2">
                    <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        defaultChecked={manager.isActive}
                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-600 cursor-pointer"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                        Активний менеджер
                    </label>
                </div>
            )}

            <div className="flex gap-3 mt-8">
                <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">Скасувати</Button>
                <Button type="submit" variant="purple" className="flex-1">
                    {isEdit ? 'Зберегти зміни' : 'Додати менеджера'}
                </Button>
            </div>
        </form>
    );
}
