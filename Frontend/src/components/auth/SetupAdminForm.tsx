'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';
import { authService } from '@/services/auth.service';

export default function SetupAdminForm() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Паролі не співпадають');
            return;
        }

        setIsLoading(true);

        try {
            await authService.setupAdmin({ fullName, email, password });
            router.push('/admin');
        } catch (err: any) {
            setError(err.message || 'Помилка при створенні адміністратора');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">SL</div>
                        <span className="font-bold text-slate-900 text-2xl">SmartLogist</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Перше налаштування</h1>
                    <p className="mt-2 text-slate-600">Створіть головного адміністратора системи</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <FormField label="Повне ім'я" id="fullName">
                            <Input
                                id="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                placeholder="Олександр Іванов"
                            />
                        </FormField>

                        <FormField label="Email" id="email">
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@smartlogist.ua"
                            />
                        </FormField>

                        <FormField label="Пароль" id="password">
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </FormField>

                        <FormField label="Підтвердіть пароль" id="confirmPassword">
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </FormField>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button type="submit" isLoading={isLoading} className="w-full py-3 h-12 text-base font-semibold">
                            Створити адміністратора
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
