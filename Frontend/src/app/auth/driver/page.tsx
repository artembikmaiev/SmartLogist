'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { authService } from '@/services/auth.service';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Input from '@/components/ui/Input';

export default function DriverLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.login({ email, password });
            router.push('/driver');
        } catch (err: any) {
            setError(err.message || 'Невірний email або пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-slate-100 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SL</span>
                        </div>
                        <span className="font-bold text-slate-900 text-2xl">SmartLogist</span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold text-slate-900">Вхід для водія</h1>
                    <p className="mt-2 text-slate-600">Увійдіть до особистого кабінету</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormField label="Email" id="email">
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="py-3 focus:ring-green-600/20 focus:border-green-600"
                                placeholder="driver@smartlogist.ua"
                            />
                        </FormField>

                        <FormField label="Пароль" id="password">
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="py-3 focus:ring-green-600/20 focus:border-green-600"
                                placeholder="••••••••"
                            />
                        </FormField>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full py-3 h-12 text-base font-semibold"
                        >
                            Увійти
                        </Button>
                    </form>

                    {/* Links */}
                    <div className="mt-6 text-center space-y-2">
                        <Link href="/auth/manager" className="text-sm text-blue-600 hover:text-blue-700 block">
                            Увійти як менеджер
                        </Link>
                        <Link href="/" className="text-sm text-slate-600 hover:text-slate-700 block">
                            Повернутися на головну
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
